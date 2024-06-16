import io
import numpy as np
import pandas as pd
import torch
from tqdm import tqdm
from constants import FACTORIZED_OBJECTS, ColumnsInfo


def process_xlsx_file_from_bytesio_to_dataframe(file_stream: io.BytesIO):
    return pd.read_excel(file_stream)


def presetup_columns_for_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    if any(df.columns.map(lambda a: 'col' in a)):
        df.columns = df.iloc[0]
        df = df.drop(0)
    if any(df.columns.map(lambda a: 'Unnamed' in a if not pd.isna(a) else False)):
        c = []
        for i, j in zip(df.columns, df.iloc[0].values):
            k = i
            if 'Unnamed' in i:
                k = j
            c.append(k)

        df = df.iloc[1:]
        df.columns = c
    if any(df.columns.map(lambda a: 'VALUE' in a if not pd.isna(a) else False)):
        df = df.iloc[1:]
    return df


def columns_to_norm_form(source: pd.DataFrame) -> pd.DataFrame:
    df = source.copy()
    df.columns = df.columns.map(lambda a: ColumnsInfo.columns_norm_forms[a] if a in ColumnsInfo.columns_norm_forms else a)
    return df


def get_only_usefull_columns(source: pd.DataFrame):
    usefull_columns = ColumnsInfo.usfull_columns_in_anomaly_ts + ColumnsInfo.usfull_columns_in_buildings_data
    data = []
    for i in np.unique(usefull_columns):
        if i in source.columns:
            data.append(source.loc[:, [i,]])
    return pd.concat(data, axis=1).copy()


def factorize_columns(source: pd.DataFrame):
    df = source.copy()
    for i in df.columns.intersection(FACTORIZED_OBJECTS):
        f = FACTORIZED_OBJECTS[i]
        df[i] = df[i].map(lambda a: ((f['NaN'] if 'NaN' in f else -1) if pd.isna(a) else f[a]) if a in f else -1)
    return df


def save_only_usfull_events(source: pd.DataFrame) -> pd.DataFrame:
    df = source.copy()
    if 'Наименование' in df.columns:
        usefull_events_index = df.loc[:, 'Наименование'].isin(ColumnsInfo.usefull_events)
        return df[usefull_events_index]
    return df


def get_buildings_dataset(dfs: list[pd.DataFrame]) -> pd.DataFrame | None:
    list_of_cleaned_dataframe: list[pd.DataFrame] = []
    for df_i in tqdm(dfs, desc='get_buildings_dataset'):
        cols_i = df_i.columns.intersection(ColumnsInfo.usfull_columns_in_buildings_data)
        list_of_cleaned_dataframe.append(df_i.loc[:, cols_i])
    if len(list_of_cleaned_dataframe):
        unom_ids = np.unique(sum([i['UNOM'].to_list() for i in list_of_cleaned_dataframe if 'UNOM' in i.columns], []))
        merged_dataframe = pd.DataFrame({'UNOM': unom_ids.astype(float).astype(int)})
        for i in tqdm(list_of_cleaned_dataframe, desc='gbd'):
            if 'UNOM' in i.columns:
                i['UNOM'] = i['UNOM'].astype(int)
                merged_dataframe = pd.merge(merged_dataframe, i, how='left', on='UNOM')
        return merged_dataframe.drop_duplicates()


def scale_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    for i in tqdm(df.columns.intersection(ColumnsInfo.scale_data), desc='scale_dataframe'):
        min_v, max_v = ColumnsInfo.scale_data[i]['min'], ColumnsInfo.scale_data[i]['max']
        df[i] = (df[i].map(lambda a: float(a.replace(',', '.')) if type(a) is str else a) - min_v) / (max_v - min_v)
    return df


def process_buildings_dataframe(building_df: pd.DataFrame) -> pd.DataFrame:
    buildings_dataset = factorize_columns(building_df)
    buildings_dataset = process_datetime_in_dataframe(buildings_dataset)
    buildings_dataset = scale_dataframe(buildings_dataset)
    return buildings_dataset


def process_datetime_in_dataframe(source: pd.DataFrame) -> pd.DataFrame:
    min_date = {
        'Дата документа о регистрации адреса': pd.Timestamp('1958-10-10 00:00:00'),
        'Дата регистрации адреса в Адресном реестре': pd.Timestamp('1998-10-20 00:00:00')
    }
    df = source.copy()
    for col in min_date:
        if col in source.columns:
            df[col] = (df[col] - min_date[col]).map(lambda a: a.days)
    return df


def process_weathers_dataframe(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    encode_weather_type = pd.DataFrame([{k: int(k in i) for k in ColumnsInfo.weathers_types} for i in df['описание погоды'].map(lambda a: a.split(', '))], index=df.index)
    data_weather_encoded = pd.concat([df, encode_weather_type], axis=1).drop(['описание погоды', 'время'], axis=1)
    data_weather_encoded = scale_dataframe(data_weather_encoded) 
    data_weather_encoded['timeline'] = pd.to_datetime(data_weather_encoded['timeline']) 
    data_weather_encoded['days'] = data_weather_encoded['timeline'].map(lambda a: a.round(freq='d')) 
    data_weather_encoded['houres'] = data_weather_encoded['timeline'].map(lambda a: a.round(freq='h')) 
    return data_weather_encoded


def prep_building_df_for_model(building_df: pd.DataFrame) -> torch.Tensor:
    d = []
    for i in tqdm(ColumnsInfo.building_column_for_model, desc='prep_building_df_for_model'):
        if not i in building_df.columns:
            d.append(pd.Series(np.full(building_df.shape[0], -1), name=i))
        else:
            df_i = building_df.loc[:, i]
            df_i = df_i.reset_index()
            d.append(df_i)
    df_r = pd.concat(d, axis=1).drop('index', axis=1)
    return torch.from_numpy(df_r.fillna(-1).values)


def get_dataframe_for_heat_station():
    pass


def get_anomalies_on_heat_station():
    pass