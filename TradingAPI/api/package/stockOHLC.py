#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 14:07:51 2020

@author: lundypang

##### Start of Stock OHLC DATA ###########
# Parameters:
# ticker - symbol should follow yahoo signals.
# interval - 1, 5, 15, 30, 60, D, W, M
# startDate - Follow dd/mm/yyyy format
# endDate - same  as start Date should be left blank if defaulted to today

"""

import time
import json
import requests
import numpy as np
import pandas as pd

#from ..Tech_indicator.RSI import RSI
from ..Others.timeConversion import unix_Date, date_Unix


def stockOHLC(bar_data, token):
    bar = bar_data
    Symbol = bar['ticker']
    resolution = str(bar['interval'])  # 1,5 etc etc
    t_Start = str(date_Unix(bar['startDate']))  # start time
    if (date_Unix(bar['endDate'])+4314000) > int(time.time()):
        t_End = str(int(time.time()))
    else:
        t_End = str(date_Unix(bar['endDate'])+4314000)
    url = 'https://finnhub.io/api/v1/stock/candle?symbol='+Symbol + \
        '&resolution='+resolution+'&from='+t_Start+'&to='+t_End+'&token='+token
    #print(url)
    r = requests.get(url)
    r_json = r.json()
    r_Open = np.array(r_json['o'])
    r_High = np.array(r_json['h'])
    r_Low = np.array(r_json['l'])
    r_Close = np.array(r_json['c'])
    r_time = np.array(r_json['t'])
    df2 = pd.DataFrame(r_time, columns=['Time'])
    df2['date'] = df2['Time'].apply(lambda x: unix_Date(x))
    r_vol = np.array(r_json['v'])
    df = pd.DataFrame(r_Open, columns=['open'])
    df['high'] = r_High
    df['low'] = r_Low
    df['close'] = r_Close
    df['volume'] = r_vol
    df['date'] = df2['date']
    return json.dumps(json.loads(df.to_json(orient='records')), indent=2)
##### End of Stock OHLC DATA ###########