import io
import pandas as pd
from constants import S3_CLIENT, S3Storage


def get_file_from_s3(filename: str) -> io.BytesIO:
    file_stream = io.BytesIO()
    S3_CLIENT.download_fileobj(S3Storage.bucket_name, S3Storage.bucket_root + filename, file_stream)
    return file_stream



        
