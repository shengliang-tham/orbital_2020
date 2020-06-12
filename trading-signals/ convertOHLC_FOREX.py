#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Jun  4 15:45:21 2020

@author: lundypang
"""
import json
import requests
import time
import numpy as np
import pandas as pd
from datetime import date, datetime, timedelta

token = 'brcab6nrh5rap841ir30'

####### Time conversion Unix to GMT +8 #################
def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR
####### Time conversion Unix to GMT +8 #################

####### Forex Related Exchange #################
def getOHLC__Forex(ticker):
    Symbol = ticker
    resolution = '60'
    t_Start ='159128800'
    t_End = str(int(time.time()))
    indicator = '&indicator=bbands&timeperiod=7&seriestype=c&matype=8'
    URL = 'https://finnhub.io/api/v1/forex/candle?symbol=OANDA:'+Symbol+'&resolution='+resolution+'&from='+t_Start+'&to='+t_End+indicator+'&token='+token+'&format=json'
    r = requests.get(URL)
    r_json = r.json()
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
    df.index = df2['Time']
    df.index.names = ['Time']
    #return json.dumps(json.loads(df.to_json(orient='index')), indent=2)

def displayExchange():
    r = requests.get('https://finnhub.io/api/v1/forex/exchange?token='+token)
    return r.json()

####### Forex Related Exchange #################
    
print(date_Unix('12/06/2020'))

def date_Unix(s):
    return int(time.mktime(dt.datetime.strptime(s, "%d/%m/%Y").timetuple()))


####### Stock Related Exchange #################
def getOHLC__Stocks(ticker):
    resolution = '5'
    symbol = ticker
    t_Start ='1591228800'
    t_End = str(int(time.time()))
    url = 'https://finnhub.io/api/v1/stock/candle?symbol='+symbol+'&resolution='+resolution+'&from='+t_Start+'&to='+t_End+'&token='+token

    r = requests.get(url)
    r_json = r.json()
    print(r_json)
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
    df.index = df2['Time']
    df.index.names = ['Time']
    return(df)
####### Stock Related Exchange #################
    
#print(getOHLC__Stocks('Z74.SI'))

####### Stock Related Information ###############
### only works for US markets
def getUSCompNews(ticker):
    resolution = '5'
    symbol = ticker
    t_Start ='2020-05-01'
    t_End = str(date.today())
    url = 'https://finnhub.io/api/v1/company-news?symbol='+symbol+'&from='+t_Start+'&to='+t_End+'&token='+token
    r = requests.get(url)
    return r.json()

def compProfile(ticker):
    r = requests.get('https://finnhub.io/api/v1/stock/profile2?symbol='+ticker+'&token='+token)
    q = requests.get('https://finnhub.io/api/v1/stock/metric?symbol='+ticker+'&metric=all&token='+token)
    t = r.json()
    y = q.json()
    t.update(y['metric'])
    return json.dumps(t)
####################
    
##### Technical indcators ######

def TA(ticker):    
    r = requests.get('https://finnhub.io//api/v1/forex/candle?symbol=OANDA:EUR_USD&resolution=D&count=250&indicator=bbands&timeperiod=7&seriestype=c&matype=8&token='+token)
    return r.json()



    
    
    
    
    
    
    
    
    
    
    
    

