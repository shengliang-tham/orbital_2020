#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun 15 17:42:52 2020

@author: lundypang
"""
import time
#import json
import requests

import api.Others.timeConversion as tc


#def backTesting(currentBalance, riskProfile, instruments,ticker):
Symbol = 'EUR_USD'
token = 'brcab6nrh5rap841ir30'

t_Start = str(tc.date_Unix('03/05/2020'))  # start time

if (tc.date_Unix('05/05/2020')+4314000) > int(time.time()):
    t_End = str(int(time.time()))
else:
    t_End = str(tc.date_Unix('05/05/2020')+4314000)
URL = 'https://finnhub.io/api/v1/indicator?symbol='+Symbol+'&resolution=' + \
    '15'+'&from='+t_Start+'&to='+t_End+'&token='+token
r = requests.get(URL)
df = r.json()
    

#backTesting(2000,2,2,'EUR_USD')

#### choosing financial instrument
# print("What instruments are we trading \n(1) for Forex (2) for Stocks")
# instruments = input("Enter 1 or 2: ")
# if (instruments == '2') :
#         print("unfortunately AutoTrader is not available")
#         time.sleep(2)
#         exit()
# print("Choose the instrument you would like to trade: \nEUR_USD\n...")
# ticker = input("Enter your choice: ")
# #retrieve     

# ### inputing user details
# currentBalance  = float(input("Input Current Balance: "))
# riskProfile = float(input("Please input the amount to risk per trade (eg: 2 for 2%) :"))

# ###Choose option backTesting or live trading
# mode = int(input("please indicate (1) Live Trading (2) Back Test: "))
# if (mode == 2):
#     backTesting(currentBalance, riskProfile, instruments,ticker)
    
# elif (mode == 1):
#     liveTrading(currentBalance, riskProfile, instruments,ticker)
    
# else:
#     print("invalid entry terminating...")
#     time.sleep(2)
#     exit()
    


    
    
    
    
    
    
    
    
    

#def liveTrading(currentBalance, riskProfile, instruments,ticker):