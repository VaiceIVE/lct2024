from fastapi import BackgroundTasks, FastAPI, File, UploadFile
import pandas as pd
import os
import numpy as np
from typing import List
import logging
from dotenv import load_dotenv
from worker import pandas_handling
import requests
import json
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
app = FastAPI()
backend_url = os.environ.get("BACKEND_URL")
if backend_url == None:
    raise Exception('No Env')

app.add_middleware(
    CORSMiddleware,
    allow_origins=
    [
        "http://localhost:4200/",
        "http://127.0.0.1:4200/",
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "https://api.adera-team.ru",
        "https://api.adera-team.ru/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/process")
async def process_new(files: List[UploadFile] = File(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    dfs = []
    dfs_for_join = []
    dfs_with_code = []
    for file in files:
        if file.size > 10000000:
            continue
        logging.warning(file)
        df = pd.read_excel(await file.read())
        df = df.T.reset_index().T
        header = df.head(5)
        contains_code = False
        contains_unom = False
        if find_column(header, ['Материал']):
            df = df.rename(columns={find_column(header, ['Материал']): 'wallMaterial'})
        if find_column(header, ['Назначение']):
            df = df.rename(columns={find_column(header, ['Назначение']): 'objType'})
        if find_column(header, ['Этажность']):
            df = df.rename(columns={find_column(header, ['Этажность']): 'floorsAmount'})

        if find_column(header, ['Муниципальный округ']):
            df = df.rename(columns={find_column(header, ['Муниципальный округ']): 'munOkr'})

        if find_column(header, ['Административный округ']):
            df = df.rename(columns={find_column(header, ['Административный округ']): 'admOkr'})

        if find_column(header, ['Общая площадь']):
            df = df.rename(columns={find_column(header, ['Общая площадь']): 'totalArea'})

        if find_column(header, ['Адрес ТП']):
            df = df.rename(columns={find_column(header, ['Адрес ТП']): 'addressTP'})

        if find_column(header, ['Вид ТП']):
            df = df.rename(columns={find_column(header, ['Вид ТП']): 'type'})

        if find_column(header, ['Источник теплоснабжения']):
            df = df.rename(columns={find_column(header, ['Источник теплоснабжения']): 'heatSource'})

        if find_column(header, ['Дата ввода в эксплуатацию']):
            df = df.rename(columns={find_column(header, ['Дата ввода в эксплуатацию']): 'dateStartUsage'})

        if find_column(header, ['Балансодержатель']):
            df = df.rename(columns={find_column(header, ['Балансодержатель']): 'authority'})

        if find_column(header, ['Адрес строения', 'Упрощённое написание адреса или описание местоположения', 'Адрес']):
            df = df.rename(columns={find_column(header,  ['Адрес строения', 'Упрощённое написание адреса или описание местоположения', 'Адрес']): 'address'})

        if find_column(header, ['geodata_center']):
            df = df.rename(columns={find_column(header,  ['geodata_center']): 'geodata'})

        if find_column(header, ['geoData']):
            df = df.rename(columns={find_column(header,  ['geoData']): 'geoBoundary'})

        if find_column(header, ['Улица']):
            num = find_column(header, ['Улица'])
            df['address'] = df[num - 1].fillna('').astype(str) + df[num].fillna('').astype(str) + ' ' + df[num + 1].fillna('').astype(str) + ' ' + df[num + 2].fillna('').astype(str) + ' ' + df[num + 3].fillna('').astype(str) + ' ' + df[num + 4].fillna('').astype(str) + ' ' + df[num + 5].fillna('').astype(str) 
        if find_column(header, ['unom', 'UNOM']):
            df = df.rename(columns={find_column(header, ['unom', 'UNOM']): 'unom'})
            contains_unom = True
        if find_column(header, ['Номер ТП', 'ЦТП']):
            df = df.rename(columns={find_column(header, ['Номер ТП', 'ЦТП']): 'code'})
            contains_code = True
        if contains_code and not contains_unom:
            dfs_with_code.append(df)
        if contains_unom:
            dfs_for_join.append(df)

        for name in df.columns.to_list():
            logging.warning(name)
        dfs.append(df)
    

    df = dfs_for_join[0]
    for jdf in dfs_for_join[1:]:
        df = pd.merge(df, jdf, on=['unom'])#, how='outer'
    valid_names = ['unom', 'address', 'geodata', 'authority', 'dateStartUsage', 'heatSource', 'type', 'addressTP', 'code', 'totalArea', 'admOkr', 'munOkr', 'floorsAmount', 'objType', 'wallMaterial', 'geoBoundary']
    df = df.rename(columns={'address_x': 'address'})
    df = df.iloc[1:]
    logging.warning("UNOM FINAL")
    for name in df.columns.to_list():
        logging.warning(name)
    columns = []
    for name in valid_names:
        if name in df.columns.to_list():
            column = df[name]
            columns.append(column.astype(str))
    new_df = pd.concat(columns, axis=1)
    logging.warning("UNOM FINAL COLUMNATED")
    for name in df.columns.to_list():
        logging.warning(name)
    df_code = dfs_with_code[0]
    for jdf in dfs_with_code[1:]:
        df_code = pd.merge(df_code, jdf, on=['code'])
    
    columns = []
    for name in valid_names:
        if name in df_code.columns.to_list() and name != 'unom':
            column = df_code[name]
            columns.append(column.astype(str))
    new_df_code = pd.concat(columns, axis=1)
    new_df_code = new_df_code.drop_duplicates('code', keep='first')
    logging.warning("CODE FINAL")
    for name in new_df_code.columns.to_list():
        logging.warning(name)
    logging.warning(len(new_df_code.index))
    batch_size = 50
    tasks = []
    logging.warning(len(new_df.index))
    counter = 0
    #new_df = pd.concat([new_df, new_df_code])
    for i in range(0, len(new_df.index), batch_size):
        df_encoded = new_df.iloc[i:i + batch_size + 1,:].to_dict()
        counter += 1
        task = pandas_handling.delay(df_encoded)
        tasks.append(task)

    for i in range(0, len(new_df_code.index), batch_size):
        df_encoded = new_df_code.iloc[i:i + batch_size + 1,:].to_dict()
        counter += 1
        task = pandas_handling.delay(df_encoded)
        tasks.append(task)

    tasks_ids = []
    for task in tasks:
        tasks_ids.append(task.id)
        await requests.post(backend_url, data=json.dumps(task.get(), indent=2), headers={'Content-Type': 'application/json'})
    buffers = []
    for file in files:
        await file.seek(0)
        buffers.append(await file.read())
    background_tasks.add_task(process, buffers)

    return tasks_ids


@app.post("/process_old")
async def process(files: List[bytes]):
    for file in files:
        features_dict = dict()

        df=pd.read_excel(file)

        df = df.T.reset_index().T
        header = df.head(5)
        
        if find_column(header, ['unom', 'UNOM']):
            features_dict.update({'unom': find_column(header, ['unom', 'UNOM'])})
        if find_column(header,  ['Материал']):
            features_dict.update({'wallMaterial': find_column(header, ['Материал'])})
        if find_column(header, ['Назначение']):
            features_dict.update({'objType': find_column(header, ['Назначение'])})
        if find_column(header, ['Этажность']):
            features_dict.update({'floorsAmount': find_column(header, ['Этажность'])})
        if find_column(header, ['Муниципальный округ']):
            features_dict.update({'munOkr': find_column(header, ['Муниципальный округ'])})
        if find_column(header, ['Административный округ']):
            features_dict.update({'admOkr': find_column(header, ['Административный округ'])})
        if find_column(header, ['Общая площадь']):
            features_dict.update({'totalArea': find_column(header, ['Общая площадь'])})
        if find_column(header, ['Номер ТП', 'ЦТП']):
            features_dict.update({'code': find_column(header, ['Номер ТП', 'ЦТП'])})
        if find_column(header, ['Адрес ТП']):
            features_dict.update({'addressTP': find_column(header, ['Адрес ТП'])})
        if find_column(header, ['Вид ТП']):
            features_dict.update({'type': find_column(header, ['Вид ТП'])})
        if find_column(header, ['Источник теплоснабжения']):
            features_dict.update({'heatSource': find_column(header, ['Источник теплоснабжения'])})
        if find_column(header, ['Дата ввода в эксплуатацию']):
            features_dict.update({'dateStartUsage': find_column(header, ['Дата ввода в эксплуатацию'])})
        if find_column(header, ['Балансодержатель']):
            features_dict.update({'authority': find_column(header, ['Балансодержатель'])})
        if find_column(header, ['Адрес строения', 'Упрощённое написание адреса или описание местоположения', 'Адрес']):
            features_dict.update({'address': find_column(header, ['Адрес строения', 'Упрощённое написание адреса или описание местоположения', 'Адрес'])})
        if find_column(header, ['geodata_center']):
            features_dict.update({'geodata': find_column(header, ['geodata_center'])})
        if find_column(header, ['Улица']):
            num = find_column(header, ['Улица'])
            df['address'] = df[num - 1].fillna('').astype(str) + df[num].fillna('').astype(str) + ' ' + df[num + 1].fillna('').astype(str) + ' ' + df[num + 2].fillna('').astype(str) + ' ' + df[num + 3].fillna('').astype(str) + ' ' + df[num + 4].fillna('').astype(str) + ' ' + df[num + 5].fillna('').astype(str) 
            df = df.T.reset_index().T
            features_dict.update({'address': find_column(df.head(5), ['address'])})

        #features_dict.update({'addressTP': find_column(header, ['Адрес ТП'])})
        #features_dict.update({'addressTP': find_column(header, ['Адрес ТП'])})
        #features_dict.update({'addressTP': find_column(header, ['Адрес ТП'])})
        #features_dict.update({'addressTP': find_column(header, ['Адрес ТП'])})
        #features_dict.update({'addressTP': find_column(header, ['Адрес ТП'])})
        #features_dict.update({'addressTP': find_column(header, ['Адрес ТП'])})

        columns = []

        for column_name in features_dict.keys():
            column = df[[features_dict[column_name]]]
            column = column.iloc[1:,].reindex()
            column = column.rename(columns={features_dict[column_name]: column_name})
            columns.append(column.astype(str))

        new_df = pd.concat(columns, axis=1)

        batch_size = 50
        tasks = []
        tasks_ids = []
        logging.warning(len(df.index))
        counter = 0

        for i in range(0, len(df.index), batch_size):
            df_encoded = new_df.iloc[i:i + batch_size + 1,:].to_dict()
            counter += 1
            task = pandas_handling.delay(df_encoded)
            tasks.append(task)
        for task in tasks:
            tasks_ids.append(task.id)
            await requests.post(backend_url, data=json.dumps(task.get(), indent=2), headers={'Content-Type': 'application/json'})
        logging.warning(counter)
    #8450
    return {"result": tasks_ids}


def find_column(df, names):
    try:
        _, col = np.where(df.isin(names))
        if col[0]:
            return int(col[0])
#        elif col[0]:
#            return int(col[0])
        else:
            return False
    except Exception as e:
        logging.warning(str(names) +  '\n')
        logging.warning(e)
        return None
        
