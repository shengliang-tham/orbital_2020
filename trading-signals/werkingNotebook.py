#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun  8 15:01:24 2020

@author: lundypang
"""
import json
import requests
import time
import numpy as np
import pandas as pd
from datetime import date, datetime, timedelta

####### Time conversion Unix to GMT +8 #################
def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR
####### Time conversion Unix to GMT +8 #################

token = 'brcab6nrh5rap841ir30'
ticker ='EUR_USD'


def RSI(DF, n):
    df = DF.copy()
    df['delta'] = df['Close'] - df['Close'].shift(1)
    df['gain'] = np.where(df['delta']>0,df['delta'],0)
    df['loss'] = np.where(df['delta']<0,abs(df['delta']),0)
    avg_gain = []
    avg_loss = []
    gain = df['gain'].tolist()
    loss = df['loss'].tolist()
    for i in range(len(df)):
        if i < n:
            avg_gain.append(np.NaN)
            avg_loss.append(np.NaN)
        elif i == n:
            avg_gain.append(df['gain'].rolling(n).mean().tolist()[n])
            avg_loss.append(df['loss'].rolling(n).mean().tolist()[n])
        elif i > n:
            avg_gain.append(((n-1)*avg_gain[i-1] + gain[i])/n)
            avg_loss.append(((n-1)*avg_loss[i-1] + loss[i])/n)
    df['avg_gain'] = np.array(avg_gain)
    df['avg_loss'] = np.array(avg_loss)
    df['RS'] = df['avg_gain']/df['avg_loss']
    df['RSI'] = 100 - (100/(1+df['RS']))
    return df['RSI']



Symbol = ticker
resolution = '60'
t_Start ='159128800'
t_End = str(int(time.time()))
indicator = '&indicator=ema&timeperiod=20'
URL = 'https://finnhub.io/api/v1/indicator?symbol=OANDA:'+Symbol+'&resolution='+resolution+'&from='+t_Start+'&to='+t_End+indicator+'&token='+token
r = requests.get(URL)
r_json = r.json()
r_ema20 = np.array(r_json['ema']) ## hardcode stub to be replaced
r_Open = np.array(r_json['o'])
r_High = np.array(r_json['h'])
r_Low = np.array(r_json['l'])
r_Close = np.array(r_json['c'])
r_time = np.array(r_json['t'])
df2 = pd.DataFrame(r_time,columns=['Time'])
df2['Time'] = df2['Time'].apply(lambda x: unix_Date(x))
r_vol = np.array(r_json['v'])
df = pd.DataFrame(r_Open,columns=['Open'])
df['High'] = r_High
df['Low'] = r_Low
df['Close'] = r_Close
df['Volume'] = r_vol
df['Date'] = df2['Time']
df['ema20'] = r_ema20 ## hardcode stub to be replace
# df.index = df2['Time']
# df.index.names = ['Time']
#### indcators #######
## RSI
df['RSI'] = RSI(df,14)
## MACD 
# a = 12 ## fast period
# b = 26 ## slow period
# c = 9 ## signal period
# df["MA_Fast"] = df["Close"].ewm(span=a, min_periods=a).mean()
# df["MA_Slow"] = df["Close"].ewm(span=b, min_periods=b).mean()
# df["MACD"] = df["MA_Fast"] - df["MA_Slow"]
# df["Signal"] = df["MACD"].ewm(span=c,min_periods=c).mean()
#### indcators ########
print(json.dumps(json.loads(df.to_json(orient='index')), indent=2))





