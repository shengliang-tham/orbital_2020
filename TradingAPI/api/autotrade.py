#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 14:07:51 2020

@author: lundypang

"""
import json
import requests
import numpy as np
import pandas as pd
import api.package.helper as h

token = 'brcab6nrh5rap841ir30'
orderList = []
def autotrade(t_Start, 
              t_End,
              Symbol,
              SLpips,
              balance,
              risk,
              token):
    risk = int(risk)
    balance = float(balance)
    SLpips = int(SLpips)
    timeManager = 4406400
    currentTime = h.date_Unix(t_Start)
    tempEnd = currentTime + timeManager
    t_End = h.date_Unix(t_End)
    first = True
    a = np.array([])
    while (t_End > currentTime):
        if tempEnd > t_End:
            tempEnd = t_End
        URL = 'https://finnhub.io/api/v1/indicator?symbol=OANDA:'+Symbol+'&resolution=' + \
            '15'+'&from='+str(currentTime)+'&to='+str(tempEnd)+'&token='+token
        tempEnd += timeManager
        currentTime += timeManager
        r = requests.get(URL)
        r_json = r.json()
        r_Open = np.array(r_json['o'])
        r_High = np.array(r_json['h'])
        r_Low = np.array(r_json['l'])
        r_Close = np.array(r_json['c'])
        r_time = np.array(r_json['t'])    
        df = pd.DataFrame(r_time, columns=['Time'])
        df['Time'] = df['Time'].apply(lambda x: h.unix_Date(x))
        df['High'] = r_High
        df['High'] = df['High'].apply(lambda x: round(x*1000,2))
        df['Low'] = r_Low
        df['Low'] = df['Low'].apply(lambda x: round(x*1000,2))
        df['Close'] = r_Close
        df['Close_refac'] = df['Close'].apply(lambda x: round(x*1000,2))
        df['MA10'] = df["Close"].ewm(span=10, min_periods=10).mean().apply(lambda x: round(x*1000,2))
        df['MA40'] = df["Close"].ewm(span=40, min_periods=40).mean().apply(lambda x: round(x*1000,2))
        df['Open'] = r_Open
        df['Open'] = df['Open'].apply(lambda x: round(x*1000,2))
        df = h.ATR(df,14)
        df = df.dropna(inplace=False)
        df['position'] = ''
        df['balance'] = balance
        ######## DATA COLLECTION #################
        
        ####  Begin trade ####
        arr = df.to_numpy()
        freeToTrade = True
        ##### arr[x][y]:  X row number, y col num.
        ###  y:
        # 1 = High
        # 2 = low
        # 3 = Close
        # 4 = Close_refac
        # 5 = ma10
        # 6 = ma40
        # 7 = open
        # 8 = ATR
        # 9 - position
        #10 = balance
        
        for x in range(1,arr.shape[0]):
            currentATR = arr[x][8]
            previousATR = arr[x-1][8]
            currentMA10= arr[x][5]
            previousMA10 =arr[x-1][5]
            currentMA40= arr[x][6]
            previousMA40 = arr[x-1][6]
            currentHigh= arr[x][1]
            currentLow= arr[x][2]
            currentClose= arr[x][4]
            currentOpen = arr[x][7]
            
                
            ###### Close signal
            # if trade is ongoing and is buy
            if (freeToTrade == False):
                if (abs(orderList[-1].entryprice - currentHigh) >= SLpips):
                    orderList[-1].closeOrder(arr[x][0], currentHigh)
                    balance += orderList[-1].gainLoss
                    arr[x][9] = 'Position closed'
                    freeToTrade = True
                if (abs(orderList[-1].entryprice - currentLow) >= SLpips):
                    orderList[-1].closeOrder(arr[x][0], currentLow)
                    balance += orderList[-1].gainLoss
                    freeToTrade = True
                    arr[x][9] = 'Position closed'
                    
            ###### BUY SIGNALS ################
            if ((currentATR > previousATR) & freeToTrade):
                # if ((previousMA40 < previousMA10) & (currentMA10 <= currentMA40)):
                #     orderList.append( orderClass(arr[x][0], currentOpen, 'short', LotSize(balance,risk,SLpips) ))
                #     freeToTrade = False
                #     arr[x][9] = 'short'
                    
                if ((previousMA40 > previousMA10) &(currentMA10 >= currentMA40)):
                    orderList.append( h.orderClass(arr[x][0], currentOpen, 'long', h.LotSize(balance,risk,SLpips)))
                    freeToTrade = False
                    arr[x][9] = 'long'
                    
            arr[x][10] = balance
            ###### BUY SIGNALS ################        
        if (orderList[-1].closingPrice == 0.0):
            orderList[-1].closeOrder(arr[-1][0],arr[-1][4])
        
        if (first):
            a = arr
            first = False
        else:
            a = np.append(a,arr,axis=0)
        
        # print(arr)
    # return orderList
    a = pd.DataFrame.from_records(a)
    a.columns = ['date','high', 'low','close','close_refac', 'ma10','ma40','open','atr','position','balance']
    a['high'] = a['high'].apply(lambda x: x/1000)
    a['low'] = a['low'].apply(lambda x: x/1000)
    a['ma10'] = a['ma10'].apply(lambda x: x/1000)
    a['ma40'] = a['ma40'].apply(lambda x: x/1000)
    a['atr'] = a['atr'].apply(lambda x: x/1000)
    del a['close_refac']
    return json.dumps(json.loads(a.to_json(orient='records')), indent=2)

def autotrade_OrderOnly(t_Start, 
                 t_End,
              Symbol,
              SLpips,
              balance,
              risk,
              token):
    risk = int(risk)
    balance = float(balance)
    SLpips = int(SLpips)
    timeManager = 4406400
    currentTime = h.date_Unix(t_Start)
    # print(t_Start)
    # print(t_End)
    tempEnd = currentTime + timeManager
    t_End = h.date_Unix(t_End)
    while (t_End > currentTime):
        if tempEnd > t_End:
            tempEnd = t_End
        URL = 'https://finnhub.io/api/v1/indicator?symbol=OANDA:'+Symbol+'&resolution=' + \
            '15'+'&from='+str(currentTime)+'&to='+str(tempEnd)+'&token='+token
        tempEnd += timeManager
        currentTime += timeManager
        r = requests.get(URL)
        r_json = r.json()
        r_Open = np.array(r_json['o'])
        r_High = np.array(r_json['h'])
        r_Low = np.array(r_json['l'])
        r_Close = np.array(r_json['c'])
        r_time = np.array(r_json['t'])    
        df = pd.DataFrame(r_time, columns=['Time'])
        df['Time'] = df['Time'].apply(lambda x: h.unix_Date(x))
        df['High'] = r_High
        df['High'] = df['High'].apply(lambda x: round(x*1000,2))
        df['Low'] = r_Low
        df['Low'] = df['Low'].apply(lambda x: round(x*1000,2))
        df['Close'] = r_Close
        df['Close_refac'] = df['Close'].apply(lambda x: round(x*1000,2))
        df['MA10'] = df["Close"].ewm(span=10, min_periods=10).mean().apply(lambda x: round(x*1000,2))
        df['MA40'] = df["Close"].ewm(span=40, min_periods=40).mean().apply(lambda x: round(x*1000,2))
        df['Open'] = r_Open
        df['Open'] = df['Open'].apply(lambda x: round(x*1000,2))
        df = h.ATR(df,14)
        df = df.dropna(inplace=False)
        ######## DATA COLLECTION #################
        
        ####  Begin trade ####
        arr = df.to_numpy()
        freeToTrade = True
        ##### arr[x][y]:  X row number, y col num.
        ###  y:
        # 1 = High
        # 2 = low
        # 3 = Close
        # 4 = Close_refac
        # 5 = ma10
        # 6 = ma40
        # 7 = open
        # 8 = ATR
        for x in range(1,arr.shape[0]):
            currentATR = arr[x][8]
            previousATR = arr[x-1][8]
            currentMA10= arr[x][5]
            previousMA10 =arr[x-1][5]
            currentMA40= arr[x][6]
            previousMA40 = arr[x-1][6]
            currentHigh= arr[x][1]
            currentLow= arr[x][2]
            currentClose= arr[x][4]
            currentOpen = arr[x][7]
            
                
            ###### Close signal
            # if trade is ongoing and is buy
            if (freeToTrade == False):
                if (abs(orderList[-1].entryprice - currentHigh) >= SLpips):
                    orderList[-1].closeOrder(arr[x][0], currentHigh)
                    balance += orderList[-1].gainLoss
        
                    freeToTrade = True
                if (abs(orderList[-1].entryprice - currentLow) >= SLpips):
                    orderList[-1].closeOrder(arr[x][0], currentLow)
                    balance += orderList[-1].gainLoss
                    freeToTrade = True
                    
            ###### BUY SIGNALS ################
            if ((currentATR > previousATR) & freeToTrade):
                # if ((previousMA40 < previousMA10) & (currentMA10 <= currentMA40)):
                #     orderList.append( h.orderClass(arr[x][0], currentOpen, 'short', h.LotSize(balance,risk,SLpips) ))
                #     freeToTrade = False
                if ((previousMA40 > previousMA10) &(currentMA10 >= currentMA40)):
                    orderList.append( h.orderClass(arr[x][0], currentOpen, 'long', h.LotSize(balance,risk,SLpips)))
                    freeToTrade = False
               
            ###### BUY SIGNALS ################        
        if (orderList[-1].closingPrice == 0.0):
            orderList[-1].closeOrder(arr[-1][0],arr[-1][4])
    
    storedval  = pd.DataFrame(columns=['Opening Time','Ending Time','Lot Size','Order Type','Profit','Entry Price','Closing Price'])
    for obj in orderList:
        storedval = storedval.append(obj.returnPanda(), ignore_index=True)
    return json.dumps(json.loads(storedval.to_json(orient='records')), indent=2)    
