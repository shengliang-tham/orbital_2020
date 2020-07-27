#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Jul 12 14:29:46 2020

@author: lundypang
"""

import websocket
import json
import time
import requests
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import pymongo
from datetime import datetime, timedelta

# import api.package.helper as h

myclient = pymongo.MongoClient("ds239936.mlab.com", 39936)
db = myclient["orbital-dev"]
db.authenticate("shengliang", "asd123asd")
mycol = db["users"]
openingPrice = 1.1459

rabs = [{
    "date":  str(datetime.now()),
    "ticker": "OANDA:EUR_USD",
    "units": 1,
    "openPrice": openingPrice,
    "lotSize": 20000,
    "totalPrice": openingPrice*20000,
    "status": "open",
}]


myquery = {"autoTrading": True}  # check if "True" is correct
newvalues = {"$push": {"openPosition": rabs}}
x = mycol.update_many(myquery, newvalues)

print(x, "documents updated.")
# =============================================================================


token = 'brcab6nrh5rap841ir30'


class dataBLock():
    def __init__(self, Symbol):
        self.timeFrame = pd.DataFrame(columns=['Time', 'Price', 'Volume'])
        self.minteArr = pd.DataFrame(
            columns=['Open', 'High', 'Low', 'Close', 'Time'])
        # change to populate arr
        self.fifteenMinArr = self.popuARR(Symbol)
        print("=================15 Min Table=========================")
        print(self.fifteenMinArr)
        self.freetoTrade = True
        self.Symbol = Symbol
        self.SLpips = 8
        self.risk = 2
        self.lastPrice = 0.0

    def addTimeFrame(self, arr):
        self.timeFrame = self.timeFrame.append(arr, ignore_index=True)
        first = int(self.timeFrame['Time'].iloc[0])
        last = int(self.timeFrame['Time'].iloc[-1])
        print("=================Tick Table=========================")
        print(self.timeFrame)
        if (last-first) >= 60:
            highestT = 0.00000
            lowestT = 99999999999.00000
            for x in range(0, len(self.timeFrame.index)):
                if highestT < float(self.timeFrame['Price'].iloc[x]):
                    highestT = float(self.timeFrame['Price'].iloc[x])
                if lowestT > float(self.timeFrame['Price'].iloc[x]):
                    lowestT = float(self.timeFrame['Price'].iloc[x])
            arr = {'Open': str(self.timeFrame['Price'].iloc[0]), 'High': str(highestT), 'Low': str(
                lowestT), 'Close':  str(self.timeFrame['Price'].iloc[-1]), 'Time': str(first)}
            self.addtoMin(arr)
            self.timeFrame = pd.DataFrame(columns=['Time', 'Price', 'Volume'])

    def addtoMin(self, arr):
        self.minteArr = self.minteArr.append(arr, ignore_index=True)
        first = int(self.minteArr['Time'].iloc[0])
        last = int(self.minteArr['Time'].iloc[-1])
        print("=================Min Table=========================")
        print(self.minteArr)
        if (last-first) >= 900:
            highest = 0.0
            lowest = 99999999999.0
            for x in range(0, len(self.minteArr.index)):
                if highest < float(self.minteArr['High'].iloc[x]):
                    highest = float(self.minteArr['High'].iloc[x])
                if lowest > float(self.minteArr['Low'].iloc[x]):
                    lowest = float(self.minteArr['Low'].iloc[x])
                    
            highest = round(1000*highest, 2)
            arr = {'Open': str(round(self.minteArr['Open'].iloc[0]*1000, 2)), 'High': str(highest), 'Low': str(
                round(1000*lowest, 2)), 'Close':  str(round(self.minteArr['Close'].iloc[-1]*1000, 2)), 'Time': str(self.unix_Date(first))}
            self.addtofifteenMin(arr)
            self.minteArr = pd.DataFrame(
                columns=['Open', 'High', 'Low', 'Close', 'Time'])

    def addtofifteenMin(self, arr):
        print("=================15 Min Table=========================")
        print(self.fifteenMinArr)
        self.fifteenMinArr.drop(index=self.fifteenMinArr.index[[1]])
        self.fifteenMinArr = self.minteArr.append(arr, ignore_index=True)
        self.fifteenMinArr['MA10'] = self.fifteenMinArr["Close"].ewm(
            span=10, min_periods=10).mean().apply(lambda x: round(x*1000, 2))
        self.fifteenMinArr['MA40'] = self.fifteenMinArr["Close"].ewm(
            span=40, min_periods=40).mean().apply(lambda x: round(x*1000, 2))
        self.fifteenMinArr = self.ATR(self.fifteenMinArr, 14)
        self.fifteenMinArr = self.fifteenMinArr.dropna(inplace=False)
        previousATR = float(self.fifteenMinArr['ATR'].iloc[-2])
        currentATR = float(self.fifteenMinArr['ATR'].iloc[-1])
        previousMA40 = float(self.fifteenMinArr['MA40'].iloc[-2])
        currentMA40 = float(self.fifteenMinArr['MA40'].iloc[-1])
        previousMA10 = float(self.fifteenMinArr['MA10'].iloc[-2])
        currentMA10 = float(self.fifteenMinArr['MA10'].iloc[-1])
        currentHigh = float(self.fifteenMinArr['High'].iloc[-1])
        currentLow = float(self.fifteenMinArr['High'].iloc[-1])
        #         ###### Close signal
#            # if trade is ongoing and is buy
        openingPrice = self.lastPrice
        
        if (self.freeToTrade == False):
            if (abs(self.lastPrice - currentHigh) >= self.SLpips):
               # sell
                self.freeToTrade = True
            if (abs(self.lastPrice - currentLow) >= self.SLpips):
                # sell
                self.freeToTrade = True
        if ((currentATR > previousATR) & self.freeToTrade == True):
            if ((previousMA40 < previousMA10) & (currentMA10 <= currentMA40)):
                self.blast_message()
                x = mycol.update_many(myquery, newvalues)
                self.lastPrice = float(self.fifteenMinArr['Open'].iloc[-1])
                self.freeToTrade = False
            if ((previousMA40 > previousMA10) & (currentMA10 >= currentMA40)):
                # BUY
                self.blast_message()
                x = mycol.update_many(myquery, newvalues)
                self.lastPrice = float(self.fifteenMinArr['Open'].iloc[-1])
                self.freeToTrade = False

    def unix_Date(self, ts):
        datetimeCURR = (datetime.utcfromtimestamp(
            ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
        return datetimeCURR

    def date_Unix(self, s):
        return int(time.mktime(datetime.strptime(s, "%d/%m/%Y").timetuple()))

    def popuARR(self, Symbol):
        currentTime = int(time.time()-43200)
        tempEnd = int(time.time())
        URL = 'https://finnhub.io/api/v1/indicator?symbol=OANDA:'+Symbol+'&resolution=' + \
            '15'+'&from='+str(currentTime)+'&to='+str(tempEnd)+'&token='+token
        print(URL)
        r = requests.get(URL)
        r_json = r.json()
        r_Open = np.array(r_json['o'])
        r_High = np.array(r_json['h'])
        r_Low = np.array(r_json['l'])
        r_Close = np.array(r_json['c'])
        r_time = np.array(r_json['t'])
        df = pd.DataFrame(r_time, columns=['Time'])
        df['Time'] = df['Time'].apply(lambda x: self.unix_Date(x))
        df['High'] = r_High
        df['High'] = df['High'].apply(lambda x: round(x*1000, 2))
        df['Low'] = r_Low
        df['Low'] = df['Low'].apply(lambda x: round(x*1000, 2))
        df['Close'] = r_Close
        df['Close_refac'] = df['Close'].apply(lambda x: round(x*1000, 2))
        df['MA10'] = df["Close"].ewm(span=10, min_periods=10).mean().apply(
            lambda x: round(x*1000, 2))
        df['MA40'] = df["Close"].ewm(span=40, min_periods=40).mean().apply(
            lambda x: round(x*1000, 2))
        df['Open'] = r_Open
        df['Open'] = df['Open'].apply(lambda x: round(x*1000, 2))
        df = self.ATR(df, 14)
        df = df.dropna(inplace=False)
        #df['position'] = ''
        ######## DATA COLLECTION #################
        ####  Begin trade ####
        #arr = df.to_numpy()
        return df

    ########## ATR #################
    def ATR(self, DF, n):
        df = DF.copy()
        df['H-L'] = abs(df['High']-df['Low'])
        df['H-PC'] = abs(df['High']-df['Close'].shift(1))
        df['L-PC'] = abs(df['Low']-df['Close'].shift(1))
        # The Highest of the 3 is the true range
        df['TR'] = df[['H-L', 'H-PC', 'L-PC']].max(axis=1, skipna=False)
        # Simple Rolling mean
        df['ATR'] = df['TR'].rolling(n).mean()
        df['ATR'] = df['ATR'].apply(lambda x: round(x, 2))
        # Exponential mean
        # df['ATR'] = df['TR'].ewm(span=n,adjust=False.min_periods=n).mean()
        df2 = df.drop(['H-L', 'H-PC', 'L-PC', 'TR'], axis=1)
        # df2.dropna(inplace=True)
        return df2
    ########## ATR #################

    ######## Lot Calculation #################
    def LotSize(balance, risk, SLpips):
        riskFactor = risk/100
        amountWillingtoLose = balance*riskFactor
        lotSize = round(amountWillingtoLose/(SLpips*10), 2)
        if lotSize < 0.01:
            lotSize = 0.01
        return lotSize
    ######## Lot Calculation #################
    
    def blast_message():
        requests.post('http://localhost:5000/telegram/blast-message', json={
            'message': rabs
        })

# timeFrame = autotrade("EUR_USD",8,3000,3,token) works


def startTrading(Symbol):


    def on_message(ws, message):
        if "trade" in message:
            # add into array
            # convert into dataframe and convert
            price = message[message.index(
                '"p":')+len('"p:"'):message.index(',"s"')]
            time = message[message.index(
                '"t":')+len('"t:"'):message.index(',"v"')]
            volume = message[message.index(
                '"v":')+len('"v:"'):message.index('}],')]
            a.addTimeFrame(
                {'Price': price, 'Time': time[:-3], 'Volume': volume})

    def on_error(ws, error):
        print(error)

    def on_close(ws):
        print("### closed ###")

    def on_open(ws):
        ws.send('{"type":"subscribe","symbol":"OANDA:'+Symbol+'"}')

    def run(ws):
        ws.on_open = on_open
        ws.run_forever()

    if __name__ == "__main__":
        Symbol = Symbol
        a = dataBLock(Symbol)
        websocket.enableTrace(True)
        ws = websocket.WebSocketApp("wss://ws.finnhub.io?token=brcab6nrh5rap841ir30",
                                    on_message=on_message,
                                    on_error=on_error,
                                    on_close=on_close)

    # blast_message()
    run(ws)


startTrading('EUR_USD')
