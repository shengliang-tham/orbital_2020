#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Jun 21 11:46:33 2020

@author: lundypang
"""
import time
import datetime as dt
from datetime import datetime, timedelta
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
    
    def returnPanda(self):
        row = pd.DataFrame(columns=['Opening Time','Ending Time','Lot Size','Order Type','Profit','Entry Price','Closing Price'])
        row.loc[0] = [self.enterdate,self.closingDate,self.lotSize,self.status,self.gainLoss,self.entryprice,self.closingPrice]
        return row
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


####### Time Conversion ##################
def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(
        ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR

def date_Unix(s):
    return int(time.mktime(dt.datetime.strptime(s, "%d/%m/%Y").timetuple()))
####### Time Conversion ##################

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