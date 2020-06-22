#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun 15 17:42:52 2020

@author: lundypang
"""
import json
import requests
import time
import datetime as dt
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

class orderClass:
    def __init__(self, enterdate, entryprice, status, lotSize):
        self.enterdate = enterdate
        self.closingDate = enterdate
        self.entryprice = entryprice
        self.status = status
        self.closingPrice = 0.0
        self.gainLoss = 0.0
        self.lotSize = lotSize
    
    def closeOrder(self, closedate, closePrice):
        self.closingDate = closedate
        self.closingPrice = closePrice
        if (self.status == 'long'):
            self.gainLoss = round(((self.closingPrice - self.entryprice)/10000) * (100000*self.lotSize),2)
        if (self.status == 'short'):
            self.gainLoss = round(((self.entryprice - self.closingPrice)/10000) * (100000*self.lotSize),2)

    # def __str__(self):
    #     startingTime = '"'+ "starting Time"+'"'+": "+ '"'+ self.enterdate+ '",'+'"'+"ending Time"+'"'+": " + '"'+ self.closingDate+'",'
    #     lotsize = '"'+ "Lot Size"+'"'+": "+ '"'+ str(self.lotSize)+'",'
    #     return "{"+startingTime +lotsize+ ""+'"'+"Order Type"+'"'+": " + '"'+ self.status+'",'+'"'+"Profit"+'"'+": " + '"'+ str(self.gainLoss)+'",' \
    #         + '"' + "entryPrice" + '"' + ": " + '"' +str(self.entryprice)+ '",'+'"'+"closingPrice"+'"'+": "+'"'+ str(self.closingPrice)+'"' +"}"
        
    
    def __str__(self):
        startingTime = '"'+ "starting Time"+'"'+": "+ '"'+ self.enterdate+ '",'+ "\n"+'"'+"ending Time"+'"'+": " + '"'+ self.closingDate+'",'  +"\n"
        lotsize = '"'+ "Lot Size"+'"'+": "+ '"'+ str(self.lotSize)+'",' +"\n"
        return "{\n"+startingTime +lotsize+ ""+'"'+"Order Type"+'"'+": " + '"'+ self.status+'",'+" \n"+'"'+"Profit"+'"'+": " + '"'+ str(self.gainLoss)+'",' \
            " \n"+ '"' + "entryPrice" + '"' + ": " + '"' +str(self.entryprice)+ '",' +" \n"+'"'+"closingPrice"+'"'+": "+'"'+ str(self.closingPrice)+'"' +"\n}"
        

    def gainLoss(self):
        return self.gainLoss
        

# neworder = orderClass('2020-05-01 12:45:00',1094.91,'long',0.06)
# print(neworder)
# neworder.closeOrder('2020-06-15 18:45:00',1125.04 )
# print(neworder)

# def obj_str(orderClass):
#     return str(orderClass)

####### Time conversion Unix #################
def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(
        ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR

def date_Unix(s):
    return int(time.mktime(dt.datetime.strptime(s, "%d/%m/%Y").timetuple()))

########## ATR #################
def ATR(DF,n):
    df = DF.copy()
    df['H-L'] = abs(df['High']-df['Low'])
    df['H-PC'] = abs(df['High']-df['Close'].shift(1))
    df['L-PC'] = abs(df['Low']-df['Close'].shift(1))
    # The Highest of the 3 is the true range
    df['TR'] = df[['H-L','H-PC','L-PC']].max(axis=1,skipna=False)
    # Simple Rolling mean
    df['ATR'] = df['TR'].rolling(n).mean()
    df['ATR'] = df['ATR'].apply(lambda x:round(x,2))
    # Exponential mean
    # df['ATR'] = df['TR'].ewm(span=n,adjust=False.min_periods=n).mean()
    df2= df.drop(['H-L','H-PC','L-PC','TR'],axis=1)
    ##df2.dropna(inplace=True)
    return df2
########## ATR #################

######## Lot Calculation #################
def LotSize(balance, risk, SLpips):
    riskFactor = risk/100
    amountWillingtoLose = balance*riskFactor
    lotSize = round(amountWillingtoLose/(SLpips*10),2)
    if lotSize < 0.01:
        lotSize = 0.01
    return lotSize
######## Lot Calculation #################

######## Input Variables #################
SLpips = 5
spread = 7
risk = 1
orderList = []
Symbol = 'EUR_USD'
token = 'brcab6nrh5rap841ir30'
t_Start = date_Unix('02/05/2020')  # start time
# if (date_Unix('28/05/2020')+4314000) > int(time.time()):
#     t_End = str(int(time.time()))
# else:
t_End = date_Unix('20/06/2020')
balance = 2000.000
leverage = 200
######## Input Variables #################



####### Time variable if the difference in time is too big ###########3
currentTime = t_Start
print(t_Start)
print(t_End)
tempEnd = t_Start + 50000
####### Time variable if the difference in time is too big ###########3

# storedarr = np.array()

######## DATA COLLECTION #################
while (t_End > currentTime):
    if tempEnd > t_End:
        tempEnd = t_End
    URL = 'https://finnhub.io/api/v1/indicator?symbol=OANDA:'+Symbol+'&resolution=' + \
        '15'+'&from='+str(currentTime)+'&to='+str(tempEnd)+'&token='+token
    tempEnd += 4406400
    currentTime += 4406400
    r = requests.get(URL)
    r_json = r.json()
    r_Open = np.array(r_json['o'])
    r_High = np.array(r_json['h'])
    r_Low = np.array(r_json['l'])
    r_Close = np.array(r_json['c'])
    r_time = np.array(r_json['t'])    
    df = pd.DataFrame(r_time, columns=['Time'])
    df['Time'] = df['Time'].apply(lambda x: unix_Date(x))
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
    df = ATR(df,14)
    df = df.dropna(inplace=False)
    
    ### trial testing
    df['position'] = 'no position'
    df['balance'] = balance
    ######## DATA COLLECTION #################
    
    ####  Begin trade ####
    arr = df.to_numpy()
    freeToTrade = True
    Boughtprice = 0.0;
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
    # 9 = position
    # 10 = balance
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
                arr[x][9] = 'Closed Position'
                
            if (abs(orderList[-1].entryprice - currentLow) >= SLpips):
                orderList[-1].closeOrder(arr[x][0], currentLow)
                balance += orderList[-1].gainLoss
                freeToTrade = True
                arr[x][9] = 'Closed Position'
                
        ###### BUY SIGNALS ################
        if ((currentATR > previousATR) & freeToTrade):
            if ((previousMA40 < previousMA10) & (currentMA10 <= currentMA40)):
                orderList.append( orderClass(arr[x][0], currentOpen, 'short', LotSize(balance,risk,SLpips) ))
                freeToTrade = False
                arr[x][9] = 'short Position'
                
            if ((previousMA40 > previousMA10) &(currentMA10 >= currentMA40)):
                orderList.append( orderClass(arr[x][0], currentOpen, 'long', LotSize(balance,risk,SLpips)))
                freeToTrade = False
                arr[x][9] = 'long Position'
        
        
        arr[x][10] = balance

    
        
        ###### BUY SIGNALS ################        
    # if (orderList[-1].closingPrice == 0.0):
    #     orderList[-1].closeOrder(arr[-1][0],arr[-1][4])
    

        
        
# jsonString = ''
# for obj in orderList:
#     jsonString += str(obj)
# # print(json.dumps(orderList,default=obj_str).replace("\'", '"'))
# print(jsonString)
# print(balance)
















    