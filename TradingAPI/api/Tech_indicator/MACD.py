# -*- coding: utf-8 -*-
"""

@author: LundyPGK
Description: Creation of MACD
AKA Moving Average of Crossover Divergence.
Basically it has 3 exponential moving average of varying period
One Fast MA Period(12), One Slow MA Period (26) and one Signal Period(9)
Depending on Fast/Slow Cuts the Signal thats when you buy
However, gives alot of false positive must be in conjunction with other stocks
The thing is that MACD is a lagging indicator. Shit will have happened if you get the signal
"""

def MACD(DF):
    a = 12
    b = 26
    c = 9
    df = DF.copy()
    df["MA_Fast"] = df["Close"].ewm(span=a, min_periods=a).mean()
    df["MA_Slow"] = df["Close"].ewm(span=b, min_periods=b).mean()
    df["MACD"] = df["MA_Fast"] - df["MA_Slow"]
    df["Signal"] = float(df["MACD"].ewm(span=c,min_periods=c).mean())
    # technical indicators better not to have NaN
    ##df.dropna(inplace=True)
    return df
