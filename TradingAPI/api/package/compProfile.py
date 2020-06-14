#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 18:31:58 2020

@author: lundypang

Company data fundamentals

"""
import requests
import json

def compProfile(ticker,token):
    r = requests.get(
        'https://finnhub.io/api/v1/stock/profile2?symbol='+ticker+'&token='+token)
    q = requests.get('https://finnhub.io/api/v1/stock/metric?symbol=' +
                     ticker+'&metric=all&token='+token)
    
    t = r.json()
    y = q.json()
    t.update(y['metric'])
    return json.dumps(t, indent=4)