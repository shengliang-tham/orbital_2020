#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jun 12 13:52:17 2020

@author: lundypang
"""
import json
import websocket
import pandas as pd
from datetime import date, datetime, timedelta

def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(
        ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR

print("Input Forex Symbol (EUR_USD) format:")
ticker = 'OANDA:'+ input()
token = 'brcab6nrh5rap841ir30'

def on_message(ws, message):
    text = message[9:-17]
    timeStart = text.find('"t":')+4
    time = text[timeStart:]
    timeEnd = time.find(",")
    time = time[:timeEnd]
    text_final = text[:timeStart]+unix_Date(int(time)/1000)+text[timeEnd:]
    print(text_final)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    #ws.send('{"type":"subscribe","symbol":"O39.SI"}')
    #ws.send('{"type":"subscribe","symbol":"AMZN"}')
    ws.send('{"type":"subscribe","symbol":"'+ticker+'"}')
    #ws.send('{"type":"subscribe","symbol":"IC MARKETS:1"}')

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://ws.finnhub.io?token="+token,
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()
        