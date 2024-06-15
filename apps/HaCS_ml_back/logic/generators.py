import datetime
import numpy as np


def make_timeline_for_period(year: int=2022, delta=1):
    s = datetime.datetime(year=year, month=10, day=1)
    e = datetime.datetime(year=year+1, month=5, day=1)
    data = np.arange(s, e, datetime.timedelta(hours=delta)).tolist()
    return data