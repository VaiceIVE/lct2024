from enum import Enum
import json
import os
import boto3
from json import load
from dataclasses import dataclass
from dotenv import load_dotenv
from os import environ
import pandas as pd
import torch


load_dotenv()


dataclass(frozen=True)
class Pathes:
    data_buildings_unom_ids_pairs: str = './data_buildings_unom_ids_pairs.json'
    tensors: str = environ.get('TENSORS_PATH')
    weather_dataset: str = environ.get('WEATHER_DATAST_PATH')
    datasets: str = environ.get('DATASETS_PATH')
    dataframes: str = environ.get('DATAFRAMES_PATH')
    columns_info: str = environ.get('COLUMNS_INFO_PATH')
    factorizers_path: str = environ.get('FACTORIZERS_PATH')
    is_day_anomaly_model_path: str = environ.get('IS_DAY_ANOMALY_MODEL_PATH')
    what_anomaly_in_day_model_path: str = environ.get('WHAT_ANOMALY_IN_DAY_MODEL_PATH')
    weathers_tensors: str = environ.get('WEATHERS_TENSORS')


dataclass(frozen=True)
class S3Storage:
    endpoint_url: str = environ.get('S3_ENDPOINT_URL')
    aws_access_key_id: str = environ.get('S3_AWS_ACCESS_TOKEN_ID')
    aws_secret_access_key: str = environ.get('S3_AWS_ACCESS_KEY')
    bucket_name: str = environ.get('S3_BUCKET_NAME')
    bucket_root: str = environ.get('S3_BUCKET_ROOT')


with open(Pathes.columns_info) as f:
    d = json.load(f)
    @dataclass(frozen=True)
    class ColumnsInfo:
        building_column_for_model = d['building_column_for_model']
        scale_data = d['columns_scale_data']
        usless_col = d['useless_columns']
        useless_by_classification = d['useless_by_classification']
        categorical_columns = d['categorical_columns']
        usfull_columns_in_buildings_data = d['usfull_columns_for_algorithms']['usfull_columns_in_buildings_data']
        usfull_columns_in_anomaly_ts = d['usfull_columns_for_algorithms']['usefull_columns_in_anomaly_ts']
        time_columns = d['time_columns']
        usefull_events = d["usefull_events"]
        columns_norm_forms = d['columns_norm_form_pairs']
        weathers_types = d['weathers_types']
        buildings_dataframe_columns = d['buildings_dataframe_columns']
        heat_station_columns = d['heat_station_usefull_columns']


@dataclass(frozen=True)
class Models:
    is_day_anomaly = torch.jit.load(Pathes.is_day_anomaly_model_path, map_location='cpu').to('cpu')
    what_anomaly_in_day = torch.jit.load(Pathes.what_anomaly_in_day_model_path, map_location='cpu').to('cpu')


with open(environ.get('SPEC_HEAT_DATA')) as f:
    SPEC_HEAT_DATA = json.load(f)
    SPEC_HEAT_DATES = list()
    for i in SPEC_HEAT_DATA:
        for j in SPEC_HEAT_DATA[i]:
            SPEC_HEAT_DATA[i][j] = [pd.to_datetime(k) for k in SPEC_HEAT_DATA[i][j]]
            SPEC_HEAT_DATES += SPEC_HEAT_DATA[i][j]



S3_CLIENT = boto3.client(
    's3',
    endpoint_url = S3Storage.endpoint_url,
    aws_access_key_id = S3Storage.aws_access_key_id,
    aws_secret_access_key = S3Storage.aws_secret_access_key,
)


FACTORIZED_OBJECTS = dict()
for i in os.listdir(Pathes.factorizers_path):
    with open(Pathes.factorizers_path + i, 'r') as f:
        data = json.load(f)
        FACTORIZED_OBJECTS[i.split('.')[0]] = data


WEATHER_DATASET = pd.read_csv(Pathes.weather_dataset)
