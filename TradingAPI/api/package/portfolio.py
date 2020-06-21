# -*- coding: utf-8 -*-
"""
Created on Sat Jan  4 11:58:37 2020

@author: User
Description: 
    advanced web scarpping involving more than one page and converting them into a pandas dataframe
"""
import json
import requests
from bs4 import BeautifulSoup
import pandas as pd
# define the number of stocks


def getResults(bar):
    tickers = bar.split(',')
    financial_dir = {}
    for ticker in tickers:
        # getting balance sheet data from yahoo finance for the given ticker
        temp_dir = {}
        url = "https://sg.finance.yahoo.com/quote/"+ticker
        page = requests.get(url)
        page_content = page.content
        soup = BeautifulSoup(page_content, 'html.parser')
        tabl = soup.find_all(
            "div", {"class": "My(6px) Pos(r) smartphone_Mt(6px)"})
        # print(tabl)
        for t in tabl:
            rows = t.find_all(
                "span", {"class": "Trsdu(0.3s) Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(b)"})
            # print(rows)
            for row in rows:
                temp_dir["currentPrice"] = row.get_text()
        financial_dir[ticker] = temp_dir

    # storing information into a pandas dataframe
    combined_fin = pd.DataFrame(financial_dir)
    combined_fin.dropna(axis=1, inplace=True)
    tickers = combined_fin.columns

    return json.dumps(financial_dir)
    # return json.dumps(json.loads(financial_dir.to_json(orient='records')), indent=2)


print(getResults('Z74.SI,AJBU.SI'))
