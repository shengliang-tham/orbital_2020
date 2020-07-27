# -*- coding: utf-8 -*-
"""
Created on Sat July 4 11:58:37 2020

@author: User
Description: 
    advanced web scarpping involving more than one page and converting them into a pandas dataframe
"""
import json
import requests
from bs4 import BeautifulSoup
import pandas as pd
# define the number of stocks


def getResults(bar, token):
    tickers = bar.split(',')
    financial_dir = {}
    try:
        for ticker in tickers:
            # getting balance sheet data from yahoo finance for the given ticker
            temp_dir = {}
            URL= 'https://finnhub.io/api/v1/quote?symbol='+ticker+'&token='+token
            page = requests.get(URL)
            r_json = page.json()
            temp_dir["currentPrice"] = r_json['c']
            financial_dir[ticker] = temp_dir
    
        # storing information into a pandas dataframe
        combined_fin = pd.DataFrame(financial_dir)
        combined_fin.dropna(axis=1, inplace=True)
        tickers = combined_fin.columns
    
        return json.dumps(financial_dir)
    except: 
        return json.dumps()