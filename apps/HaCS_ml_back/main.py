import json
import logging
import os
import sys
import uuid
from fastapi import FastAPI
import numpy as np
import pandas as pd
from scipy.special import softmax
from sklearn.cluster import KMeans
import torch
from tqdm import tqdm
from constants import Models, Pathes
from enteties.api_requests_models import GetAnomaliesByDayModel
from logic import dataframe_processors
from logic.generators import make_timeline_for_period
from logic.pipelines import load_dataframe_pipeline, load_buildings_tensor, process_dataframe_to_buildings_tensor
from vars import DATA_BUILDINGS_UNOM_IDS_PAIRS, WEATHERS
from fastapi.middleware.gzip import GZipMiddleware
from pandas import Timestamp

logger = logging.getLogger("gunicorn.error")
logger.setLevel(logging.INFO)

moe = [
    "P1 <= 0", 
    "P2 <= 0", 
    "T1 < min", 
    "T1 > max", 
    'Аварийная протечка труб в подъезде',
    "Сильный пожар",
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
    logger.warning('Test')
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
    logger.warning(f'{Timestamp.now()}: Strating load tables')
    flags = list()
    list_of_dataframes = []
    for table_name in tqdm(body.list_of_tables):
        try:
            dataframe = load_dataframe_pipeline(table_name)
            list_of_dataframes.append(dataframe)
        except:
            logger.error(f'{Timestamp.now()}: Bad respones on table {table_name}')


    fn = '_'.join(sorted(body.list_of_tables))


    logger.warning(f'{Timestamp.now()}: Strating prep data')
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
    
    logger.warning(f'{Timestamp.now()}: Strating clusterring')
    try:
        clusters = KMeans(n_clusters=body.n_of_clusters).fit(bt).labels_
        n_clusters = set(clusters)
    except:
        logger.warning(f'{Timestamp.now()}: too few objects')
        flags.append('too_few_objects')
        clusters = KMeans(n_clusters=bt.shape[0]).fit(bt).labels_
        n_clusters = set(clusters)
    logger.info(f'{Timestamp.now()}: Strating clusterring')
    with torch.no_grad():
        # wt = wt.unsqueeze(0).repeat([bt.shape[0], 1, 1]).float()

        logger.warning(f'{Timestamp.now()}: Strating predicting with bt.shape = {bt.shape}')
        bt = bt.float()
        x = dict()
        x1 = dict()
        # window = 512
        for i in tqdm(n_clusters, desc='prediction'):
            bt_t = bt[clusters==i].mean(axis=0).unsqueeze(0)
            x[str(i)] = Models.is_day_anomaly(wt.unsqueeze(0).float(), bt_t.float()).squeeze(0).numpy().tolist()
            x[str(i)] = {tl[i2]: x[str(i)][i2] for i2 in range(len(tl))}
            x1[str(i)] = ((Models.what_anomaly_in_day(process_data_to_model_cluster(wt.unsqueeze(0), bt_t)) + 1)/2).squeeze(0).numpy().tolist()
            x1[str(i)] = {tl[i2]: {str(i3): x1[str(i)][i2][i3] for i3 in range(len(moe)) if i3 != 5} for i2 in range(len(tl))}

            # x1[i] = {{moe[j]: x[i][j] for j in range(len(moe))} for i1 in range()}
        # for i in tqdm(range(0, bt.shape[0], window)):
        #     r1 = Models.is_day_anomaly(wt[i:i+window], bt[i:i+window])
        #     r2 = ((Models.what_anomaly_in_day(process_data_to_model_cluster(wt[i:i+window], bt[i:i+window])) + 1)/2)
        #     x.append(r2)
        #     x1.append(r1)
        # r2 = torch.cat(x, dim=0)
        # r1 = torch.cat(x1, dim=0)
        # top_objects = r1.sum(dim=1).argsort()[:body.n_objects].clone()
        # r1 = torch.argsort(r1, dim=1)
        # r1 = r1.argsort(dim=1)[:, :body.n_days]
        # r2_p = r2.argsort(dim=2)[:, :, :body.n_top].numpy().tolist()
        # r2_l = r2.numpy().tolist()
    # prob2 = {
    #     unom_ids[i0]: {
    #         'tl': [tl[i.numpy()] for i in r1[i0]],
    #         'anomalies': [
    #             {moe[j]: r2_l[i0][i][j] for j in r2_p[i0][i]} for i in r1[i0]
    #         ]
    #     } 
    #     for i0 in tqdm(top_objects)
    # }
    # print(type(x['0'][0]), type(x['0']))

    logger.warning(f'{Timestamp.now()}: Strating generate respones')
    prob2 = {
        'unom_ids__clusters': {i1: i2 for i1, i2 in zip(unom_ids, clusters.tolist())},
        'clusters__day_predict': x,
        'clusters__predict_in_day': x1,
    }
    logger.warning(f'{Timestamp.now()}: Strating respones')
    return {
        'what_anomaly_propability': prob2,
        'heat_station_anomaly': []
    }
