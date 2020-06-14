# -*- coding: utf-8 -*-
"""

@author: Lundy pang
On Balance Volume:
    Volume precedes price movement.
    when volume goes up. Price usually follows suit
    It is a momentum indicator
    Unlike MACD this is a leading market indicator
    Flip this is prone to making alot of False positive
    commonly used with MACD
"""
import pandas_datareader as pdr
import numpy as np
import datetime as dt


def OBV(DF):
    df = DF.copy()
    df['Volume'] =  df['Volume'].astype(int)
    df['Direction'] = np.where((df['Close'] > df['Close'].shift(1)),1,-1)
    df['Vol_dir'] = df['Volume'] * df['Direction']
    df['OBV'] = df['Vol_dir'].cumsum() #LOL
    return df['OBV']
