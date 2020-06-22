#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 14:07:51 2020

@author: lundypang

"""

import api.package.helper as h
import api.autotrade as at
 
### Gather informations
######## Input Variables #################
SLpips = int(input("please input stop loss in pips: "))
spread = 7
risk = int(input("Please input the percentage to risk per trade 1 for 1%...: "))
orderList = []
Symbol = input("Please input the currency of choice in the following format (EUR_USD): ") #'EUR_USD'
timeframe = input("please input the timeframe of your choice: \n1. 5 mins \n2. 15 mins\n")
t_Start = h.date_Unix(input("Please input starting date in the following format (DD/MM/YYYY): "))  # start time
# if (date_Unix('28/05/2020')+4314000) > int(time.time()):
#     t_End = str(int(time.time()))
# else:
t_End = h.date_Unix(input("Please input starting date in the following format (DD/MM/YYYY): "))
balance = int(input("Please input the account balance: "))
leverage = 200
######## Input Variables #################

orderlist = at.autotrade(t_Start, t_End, Symbol, SLpips, balance, risk, timeframe)
print(orderlist)
