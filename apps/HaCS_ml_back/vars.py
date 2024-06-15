import json
import os
from constants import Pathes
from logic import dataframe_processors

if os.path.isfile(Pathes.data_buildings_unom_ids_pairs):
    with open(Pathes.data_buildings_unom_ids_pairs, 'r') as f:
        DATA_BUILDINGS_UNOM_IDS_PAIRS = json.load(f)
else:
    DATA_BUILDINGS_UNOM_IDS_PAIRS = dict()
    with open(Pathes.data_buildings_unom_ids_pairs, 'w') as f:
        json.dump(DATA_BUILDINGS_UNOM_IDS_PAIRS, f)


WEATHERS = dataframe_processors.process_weathers_dataframe(Pathes.weather_dataset)
