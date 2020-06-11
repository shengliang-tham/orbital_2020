#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun  8 15:01:24 2020

@author: lundypang
"""
import json
import requests
import time
import numpy as np
from bs4 import BeautifulSoup
import pandas as pd
from datetime import date, datetime, timedelta

####### Time conversion Unix to GMT +8 #################
def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR
####### Time conversion Unix to GMT +8 #################


#

df2 = pd.DataFrame([["1 min", "1"], 
                    ["5 min", "5"],
                    ["15 min", "15"],
                    ["30 min", "60"],
                    ["Daily", "D"],
                    ["Weekly", "W"],
                    ["Monthly", "M"]], columns=["Display","return"])
print(json.dumps(json.loads(df2.to_json(orient='records')), indent=2))






