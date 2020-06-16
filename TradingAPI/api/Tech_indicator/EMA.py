#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Jun 14 15:41:27 2020

@author: lundypang
Simple moving average
n being the timeframe
"""

def EMA(df, n):
     MA = df["close"].ewm(span=n, min_periods=n).mean()
     return MA;