```
S3_ENDPOINT_URL='https://minioapi.adera-team.ru'
S3_AWS_ACCESS_TOKEN_ID=<1>
S3_AWS_ACCESS_KEY=<2>
S3_BUCKET_NAME='tables'
S3_BUCKET_ROOT=''


COLUMNS_INFO_PATH='./columns_info.json'


IS_DAY_ANOMALY_MODEL_PATH='./models/day_anomaly_prediction_modded_2024-06-14T04:52:57.191107.pt'
WHAT_ANOMALY_IN_DAY_MODEL_PATH='./models/day_anomaly_prediction_modded_cluster_2024-06-14T12:31:00.419744.pt'
FACTORIZERS_PATH='./factorizers/'
DATAFRAMES_PATH='./dataframes/'
DATASETS_PATH='./datasets/'
WEATHER_DATAST_PATH='./datasets/weathers.csv'
TENSORS_PATH='./tensors/'
WEATHERS_TENSORS='./weathers_tensors/'
SPEC_HEAT_DATA='./turn_on_of_heat_ordered.json'
```

1 - access токен для s3 хранилища
2 - secrret токен для s3 хранилища