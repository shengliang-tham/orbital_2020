#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 18:24:30 2020

@author: lundypang

"""
import time
import datetime as dt
from datetime import datetime, timedelta
####### Time conversion Unix #################
def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(
        ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR


def date_Unix(s):
    return int(time.mktime(dt.datetime.strptime(s, "%d/%m/%Y").timetuple()))
####### Time conversion Unix #################