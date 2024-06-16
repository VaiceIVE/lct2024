import json
import logging
import os
import sys
import uuid
from fastapi import FastAPI
import numpy as np
import pandas as pd
from scipy.special import softmax
import torch
from tqdm import tqdm
from constants import Models, Pathes
from enteties.api_requests_models import GetAnomaliesByDayModel
from logic import dataframe_processors
from logic.generators import make_timeline_for_period
from logic.pipelines import load_dataframe_pipeline, load_buildings_tensor, process_dataframe_to_buildings_tensor
from vars import DATA_BUILDINGS_UNOM_IDS_PAIRS, WEATHERS
from fastapi.middleware.gzip import GZipMiddleware

logger = logging.getLogger("gunicorn.error")


moe = [
    "P1 <= 0", 
    "P2 <= 0", 
    "T1 < min", 
    "T1 > max", 
    'Аварийная протечка труб в подъезде',
    "T1 > max",
    "Отсутствие отопления в доме",
    "Протечка труб в подъезде",
    "Сильная течь в системе отопления",
    "Температура в квартире ниже нормативной",
    "Температура в помещении общего пользования ниже нормативной",
    "Течь в системе отопления"
]
app = FastAPI()
# app.add_middleware(GZipMiddleware, minimum_size=500)


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
        # torch.save(bt, Pathes.tensors + tensor_id + '.pt')

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
    return {'res': 'success'}


def process_data_to_model_cluster(x1, x2, device='cpu'):
    return torch.cat([x2.unsqueeze(1).repeat([1, 213, 1]), x1], axis=2).float().to(device)


@app.post("/get_anomalies_by_day")
def get_anomalies_by_day(body: GetAnomaliesByDayModel):
    """
        Функция получает на вход имена таблиц из S3 хранилища,число возворащаемых объектов
    """
    list_of_dataframes = []
    for table_name in tqdm(body.list_of_tables):
        try:
            dataframe = load_dataframe_pipeline(table_name)
            list_of_dataframes.append(dataframe)
        except:
            logger.error(f'Bad respones on table {table_name}')
    # m = get_heatstation_anomaly(list_of_dataframes)
    # return m.to_dict()

    fn = '_'.join(sorted(body.list_of_tables))


    if fn in DATA_BUILDINGS_UNOM_IDS_PAIRS:
        try:
            tensor_id = DATA_BUILDINGS_UNOM_IDS_PAIRS[fn]['tensor_id']
        except:
            tensor_id = str(uuid.uuid4())
        try:
            unom_ids = DATA_BUILDINGS_UNOM_IDS_PAIRS[fn]['unom_ids']
            bt = torch.load(Pathes.tensors + tensor_id + '.pt')
        except:
            bt, unom_ids = process_dataframe_to_buildings_tensor(list_of_dataframes)
            DATA_BUILDINGS_UNOM_IDS_PAIRS[fn] = {
                'tensor_id': tensor_id,
                'unom_ids': unom_ids
            }
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

    tl = np.array(make_timeline_for_period(2023, 24))
    wtn = f'{body.period}_in_days.pt'
    if os.path.isfile(Pathes.weathers_tensors + wtn):
        wt = torch.load(Pathes.weathers_tensors + wtn)
    else:
        weather = WEATHERS.drop([
            'timeline', 'houres'
        ], axis=1).drop_duplicates()
        l = []
        for i in tqdm(tl, desc='tl'):
            anomalies_idxes = weather['days'] == i
            n = anomalies_idxes.sum()
            l.append(weather[anomalies_idxes].drop('days', axis=1).sum(axis=0) / n)
        weather = pd.concat(l, axis=1).T
        wt = torch.from_numpy(weather.values)
        torch.save(wt, Pathes.weathers_tensors + wtn)
    with torch.no_grad():
        wt = wt.unsqueeze(0).repeat([bt.shape[0], 1, 1]).float()
        bt = bt.float()
        x = []
        x1 = []
        window = 512
        for i in tqdm(range(0, bt.shape[0], window)):
            r1 = Models.is_day_anomaly(wt[i:i+window], bt[i:i+window])
            r2 = ((Models.what_anomaly_in_day(process_data_to_model_cluster(wt[i:i+window], bt[i:i+window])) + 1)/2)
            x.append(r2)
            x1.append(r1)
        r2 = torch.cat(x, dim=0)
        r1 = torch.cat(x1, dim=0)
        top_objects = r1.sum(dim=1).argsort()[:body.n_objects].clone()
        r1 = torch.argsort(r1, dim=1)
        r1 = r1.argsort(dim=1)[:, :body.n_days]
        # top_objects = r1.sum(dim=1).argsort()[:body.n_objects]
        r2_p = r2.argsort(dim=2)[:, :, :body.n_top].numpy().tolist()
        r2_l = r2.numpy().tolist()
    prob2 = {
        unom_ids[i0]: {
            'tl': [tl[i.numpy()] for i in r1[i0]],
            'anomalies': [
                {moe[j]: r2_l[i0][i][j] for j in r2_p[i0][i]} for i in r1[i0]
            ]
        } 
        for i0 in tqdm(top_objects)
    }
    return {
        'what_anomaly_propability': prob2,
        'heat_station_anomaly': []
    }

