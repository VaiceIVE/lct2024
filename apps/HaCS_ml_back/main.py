import json
import logging
import os
import uuid
from fastapi import FastAPI
import pandas as pd
import torch
from tqdm import tqdm
from constants import Models, Pathes
from enteties.api_requests_models import GetAnomaliesByDayModel
from logic import dataframe_processors
from logic.generators import make_timeline_for_period
from logic.pipelines import load_dataframe_pipeline, load_buildings_tensor, process_dataframe_to_buildings_tensor
from vars import DATA_BUILDINGS_UNOM_IDS_PAIRS, WEATHERS



logger = logging.getLogger("gunicorn.error")


app = FastAPI()


@app.get("/hi")
def hello():
    logging.warning('Test')
    return {"message": "hi"}


@app.post("/set_tables")
def set_tables(body: GetAnomaliesByDayModel):
    list_of_dataframes = []
    for table_name in tqdm(body.list_of_tables):
        dataframe = load_dataframe_pipeline(table_name)
        list_of_dataframes.append(dataframe)
    buildings_dataset = dataframe_processors.get_buildings_dataset(list_of_dataframes)
    buildings_dataset = dataframe_processors.process_buildings_dataframe(buildings_dataset)
    weather = dataframe_processors.process_weathers_dataframe(Pathes.weather_dataset)

    bt = dataframe_processors.prep_building_df_for_model(buildings_dataset)
    torch.save(bt, Pathes.tensors + table_name + '.pt')


def process_data_to_model_cluster(x1, x2, device='cpu'):
    return torch.cat([x2.unsqueeze(1).repeat([1, 213, 1]), x1], axis=2).float().to(device)


@app.post("/get_anomalies_by_day")
def get_anomalies_by_day(body: GetAnomaliesByDayModel):
    list_of_dataframes = []
    for table_name in tqdm(body.list_of_tables):
        dataframe = load_dataframe_pipeline(table_name)
        list_of_dataframes.append(dataframe)

    fn = '_'.join(sorted(body.list_of_tables))
    if fn in DATA_BUILDINGS_UNOM_IDS_PAIRS:
        tensor_id = DATA_BUILDINGS_UNOM_IDS_PAIRS[fn]['tensor_id']
        unom_ids = DATA_BUILDINGS_UNOM_IDS_PAIRS[fn]['unom_ids']
        bt = torch.load(Pathes.tensors + tensor_id + '.pt')
    else:
        bt, unom_ids = process_dataframe_to_buildings_tensor(list_of_dataframes)
        tensor_id = str(uuid.uuid4())
        DATA_BUILDINGS_UNOM_IDS_PAIRS[fn] = {
            'tensor_id': tensor_id,
            'unom_ids': unom_ids
        }
    with open(Pathes.data_buildings_unom_ids_pairs, 'w') as f:
        json.dump(DATA_BUILDINGS_UNOM_IDS_PAIRS, f)
        torch.save(bt, Pathes.tensors + tensor_id + '.pt')

    tl = make_timeline_for_period(2023, 24)
    wtn = f'{body.period}_in_days.pt'
    if os.path.isfile(Pathes.weathers_tensors + wtn):
        wt = torch.load(Pathes.weathers_tensors + wtn)
    else:
        weather = WEATHERS.drop([
            'timeline', 'houres'
        ], axis=1).drop_duplicates()
        l = []
        for i in tl:
            anomalies_idxes = weather['days'] == i
            n = anomalies_idxes.sum()
            l.append(weather[anomalies_idxes].drop('days', axis=1).sum(axis=0) / n)
        weather = pd.concat(l, axis=1).T
        wt = torch.from_numpy(weather.values)
        torch.save(wt, Pathes.weathers_tensors + wtn)
    with torch.no_grad():
        wt = wt.unsqueeze(0).repeat([bt.shape[0], 1, 1]).float()
        bt = bt.float()
        r1: torch.Tensor = Models.is_day_anomaly(wt, bt).numpy().tolist()
        r2: torch.Tensor = Models.what_anomaly_in_day(process_data_to_model_cluster(wt, bt)).numpy().tolist()
    return {
        'propability_of_anomaly': {
            i: {i1: j1 for i1, j1 in zip(tl, j)} for i, j in zip(unom_ids, r1)
        },
        'what_anomaly_propability':{
            i: {i1: j1 for i1, j1 in zip(tl, j)} for i, j in zip(unom_ids, r2)
        }
    }
    


