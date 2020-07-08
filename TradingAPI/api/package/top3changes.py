#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 18:49:07 2020

@author: lundypang
"""
import math
import decimal
import json
import requests
import pandas as pd
from bs4 import BeautifulSoup

def getTop3():
   temp_dir = {}
   temp_dir2 = {}
   url = "https://finance.yahoo.com/quote/%5EDJI/components?p=%5EDJI"
   page = requests.get(url)
   page_content = page.content
   ### defining HTML Elements to look out for
   soup = BeautifulSoup(page_content, 'html.parser')
   tabl = soup.find_all("table", {"class": "W(100%) M(0) BdB Bdc($finLightGray)"})
   for t in tabl:
       rows = t.find_all("tr", {"class": "BdT Bdc($seperatorColor) Ta(end) Fz(s)"})
       for row in rows:
          if len(row.get_text(separator='|').split("|")[0:2]) > 1:
               ## retrieve the symbol name in dictionary form
               temp_dir[row.get_text(separator='|').split("|")[0]] = row.get_text(separator='|').split("|")[1]
               ## retrieve the percentage change
               temp_dir2[row.get_text(separator='|').split("|")[0]] = row.get_text(separator='|').split("|")[3]

   ##converting data into pandas table format
   df = pd.DataFrame.from_dict(temp_dir, orient='index')
   df2 = pd.DataFrame.from_dict(temp_dir2, orient='index')
   df['change'] = df2[0]
   df.columns = ["name","percentageChanged"]
   ## converting negative percentages to postives
   df['percentageChangePos'] = df['percentageChanged'].apply(lambda x: math.sqrt(float(x)*float(x)))
   df['exchange'] = "DJI"
   df.reset_index(drop=True, inplace=True)
   df2 = df
   ## sort value based on biggest change
   df.sort_values(by=['percentageChangePos'],ascending=False, inplace=True)
   ##drop once sorting is done
   del df['percentageChangePos']
   #only top 3 needed
   df2 = df.iloc[:3]
   #drop the current index which was the symbol and replaced it with a random number
   df2.reset_index(drop=True, inplace=True)
   #reset the index without adding the tickers into the frame as a coloumn
   df2.reset_index(level=0, inplace=False)
   df2['key'] = df2.index + 1
   #converting percentage change into decimal place
   df2['percentageChanged'] = df2['percentageChanged'].apply(lambda x: '{0:.2f}'.format(decimal.Decimal(x)))
   return json.dumps(json.loads(df2.to_json(orient='records')), indent=2)



