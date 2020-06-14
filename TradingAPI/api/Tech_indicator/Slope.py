# -*- coding: utf-8 -*-
"""
Created on Sun Jan  5 15:16:36 2020

@author: User
    Description:
        Using Linear Regression to find uptrend or downtrend
"""

import numpy as np

import statsmodels.api as sm

def slope(DF):
    n= 5
    ser = DF['Close']
    slopes = [i*0 for i in range(n-1)]
    for i in range(n,len(ser)+1):
        y = ser[i-n:i]
        x = np.array(range(n))
        y_scaled = (y - y.min())/(y.max() - y.min())
        x_scaled = (x - x.min())/(x.max() - x.min())
        x_scaled = sm.add_constant(x_scaled)
        model = sm.OLS(y_scaled,x_scaled)
        results = model.fit()
        slopes.append(results.params[-1])
    slope_angle = (np.rad2deg(np.arctan(np.array(slopes))))
    slope_array = np.array(slope_angle)
    slope_array = slope_array.astype('int8')
    return slope_array