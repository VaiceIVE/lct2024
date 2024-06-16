import json
import os
import numpy as np
import pandas as pd
import torch
from constants import Pathes
from logic.s3_comunication import get_file_from_s3
from logic import dataframe_processors


def load_table_from_s3_pipelines(table_name: str) -> pd.DataFrame:
    file_stream = get_file_from_s3(table_name)
    dataframe = dataframe_processors.process_xlsx_file_from_bytesio_to_dataframe(file_stream)
    dataframe_columns_preseted = dataframe_processors.presetup_columns_for_dataframe(dataframe)
    dataframe_normed_columns = dataframe_processors.columns_to_norm_form(dataframe_columns_preseted)
    return dataframe_normed_columns


def process_dataframe_to_buildings_tensor(list_of_dataframes: list[pd.DataFrame]) -> tuple[torch.Tensor, list[int]]:
    buildings_dataset = dataframe_processors.get_buildings_dataset(list_of_dataframes)
    buildings_dataset.dropna(thresh=len(buildings_dataset.columns)/2, axis=0, inplace=True)
    buildings_dataset = dataframe_processors.process_buildings_dataframe(buildings_dataset)
    print(buildings_dataset.shape)
    unom_ids, idxes = np.unique(buildings_dataset['UNOM'], return_index=True)
    unom_ids = unom_ids.tolist()
    buildings_dataset = buildings_dataset.iloc[idxes]
    bt = dataframe_processors.prep_building_df_for_model(buildings_dataset)
    return bt, unom_ids


def load_buildings_tensor(table_names: list[str]) -> tuple[torch.Tensor, list[int]]:
    fn = sum(sorted(table_names), '')
    tensor_name = fn + '.pt'
    unoim_ids_name = fn + '.json'
    if tensor_name in os.listdir(Pathes.tensors):
        bt = torch.load(Pathes.tensors + tensor_name)
        with open(Pathes.tensors + unoim_ids_name, 'r') as f:
            unom_ids = json.load(f)
    else:
        bt, unom_ids = process_dataframe_to_buildings_tensor()
        torch.save(bt, Pathes.tensors + tensor_name)
        with open(Pathes.tensors + unoim_ids_name, 'w') as f:
            json.dump(unom_ids, f)
    return bt, unom_ids



def load_dataframe_pipeline(table_name: str):
    saved_dataframes = list(map(lambda a: a.replace('.csv', ''), os.listdir(Pathes.dataframes)))
    if table_name in saved_dataframes:
        df = pd.read_csv(Pathes.dataframes + table_name + '.csv')
    else:
        df = load_table_from_s3_pipelines(table_name)
        df.to_csv(Pathes.dataframes + table_name + '.csv')
    return df
    
