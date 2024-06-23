import os
import time
import logging
from celery import Celery
import pandas as pd
from typing import Dict, Any
from dotenv import load_dotenv
load_dotenv()
import json
import requests


celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("BROKER_URL")
celery.conf.result_backend = os.environ.get("BACKEND_QUEUE_URL")
backend_url = os.environ.get("BACKEND_URL")
logging.warning(backend_url)

@celery.task(name="pandas_handling", bind=True)
def pandas_handling(self, dict_df):
    df = pd.DataFrame.from_dict(dict_df)
    logging.warning(len(df.index))

    result = dict()
    result.update({'data': list()})
    names = df.columns.to_list()
    for _, row in df.iterrows():
        resultdict = dict()
        for number, value in enumerate(row):
            if names[number] == 'unom' and not str(value).replace(',', '').replace('.', '').isdigit():
                break    
            if names[number] == 'code' and value == None:
                break             
            if str(value) == 'nan':
                continue
            if str(value).replace(',', '').isdigit():
                value = str(value).replace(',', '.')
            if names[number] == 'unom' and '.' in str(value):
                value = value.split('.')[0]
            if names[number] == 'address':
                value = value.replace('корпус', 'корп.')\
                .replace('дом', 'д.')\
                .replace('строение', 'стр.')\
                .replace('улица', 'ул.')\
                .replace('Улица', 'Ул.')\
                .replace('проспект', 'просп.')\
                .replace('Проспект', 'Просп.')\
                .replace('площадь', 'пл.')\
                .replace('Площадь', 'Пл.')\
                .replace('проезд', 'пр.')\
                .replace('Проезд', 'Пр.')
            name = names[number]
            resultdict.update({name: value})
        result['data'].append(resultdict)
    return result
    # trycounter = 0
    # try:
    #     trycounter += 1
    #     logging.warning(requests.post(backend_url, data=json.dumps(result, indent=2), headers={'Content-Type': 'application/json'}).text)
    # except Exception as e:
    #     if trycounter >= 10:
    #         return True
    #     logging.warning(e)
    #     logging.warning(result)
    #     self.retry()
    # return True


@celery.task(name="pandas_handling_old", bind=True)
def pandas_handling_old(self, dict_df):
    df = pd.DataFrame.from_dict(dict_df)
    logging.warning(len(df.index))

    result = dict()
    result.update({'data': list()})
    names = df.columns.to_list()
    for _, row in df.iterrows():
        resultdict = dict()
        for number, value in enumerate(row):
            if names[number] == 'unom' and not str(value).replace(',', '').replace('.', '').isdigit():
                break    
            if names[number] == 'code' and value == None:
                break             
            if str(value) == 'nan':
                continue
            if str(value).replace(',', '').isdigit():
                value = str(value).replace(',', '.')
            if names[number] == 'unom' and '.' in str(value):
                value = value.split('.')[0]
            if names[number] == 'address':
                value = value.replace('корпус', 'корп.')\
                .replace('дом', 'д.')\
                .replace('строение', 'стр.')\
                .replace('улица', 'ул.')\
                .replace('Улица', 'Ул.')\
                .replace('проспект', 'просп.')\
                .replace('Проспект', 'Просп.')\
                .replace('площадь', 'пл.')\
                .replace('Площадь', 'Пл.')\
                .replace('проезд', 'пр.')\
                .replace('Проезд', 'Пр.')
            name = names[number]
            resultdict.update({name: value})
        result['data'].append(resultdict)
    trycounter = 0
    try:
        trycounter += 1
        logging.warning(requests.post(backend_url, data=json.dumps(result, indent=2), headers={'Content-Type': 'application/json'}).text)
    except Exception as e:
        if trycounter >= 10:
            return True
        logging.warning(e)
        logging.warning(result)
        self.retry()
    return True