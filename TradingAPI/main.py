#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 14:07:51 2020

@author: lundypang

"""
import json
from flask import Flask, request
from flask_restful import Api
from flask_cors import CORS

import api.package.forexOHLC as FOHLC
import api.package.stockOHLC as SOHLC
import api.package.compProfile as cp
import api.package.stockPredict as sp
import api.package.top3changes as t3
import api.package.pooling as pool
import api.package.portfolio as pf
import api.autotrade as at
import os

app = Flask(__name__)
CORS(app)
api = Api(app)

with open('cred.json') as f:
    data = json.load(f)

token = data['Credentials']['token']

######## OHLC DATA ###############


@app.route('/api/forexOHLC', methods=['GET'])
def forexAPI():
    bar = request.args.to_dict()
    return FOHLC.forexOHLC(bar, token)


@app.route('/api/stockOHLC', methods=['GET'])
def stockAPI():
    bar = request.args.to_dict()
    return SOHLC.stockOHLC(bar, token)

######## Pooling DATA ###############


@app.route('/api/instrument-pool', methods=['GET'])
def instrumentPool():
    return pool.instrumentPool()


@app.route('/api/time-pool', methods=['GET'])
def timePool():
    return pool.timePool()

######## Fundamental DATA ###############


@app.route('/compProfile/<string:ticker>', methods=['GET'])
def compProfile(ticker):
    return cp.compProfile(ticker, token)

######## Stock prediction ###############


@app.route('/stockpredict/<string:tick>', methods=['GET'])
def get(tick):
    with app.app_context():
        return sp.get(tick)

#### Start of Web Scraping for Top 3 ###########


@app.route('/api/getTop3', methods=['GET'])
def getTop3():
    return t3.getTop3()

#### Start of Web Scraping for portfolio ###########


@app.route('/api/getPortfolio', methods=['GET'])
def portfolio():
    bar = request.args.to_dict()
    tickers = bar["tickers"]
    return pf.getResults(tickers, token)


@app.route('/api/backtestForex', methods=['GET'])
def backtestForex():
    bar = request.args.to_dict()
    t_Start = bar['t_Start']
    t_End = bar['t_End']
    Symbol = bar['Symbol']
    SLpips = bar['SLpips']
    balance = bar['balance']
    risk = bar['risk']
    return at.autotrade(t_Start, t_End, Symbol, SLpips, balance, risk, token)


@app.route('/api/backtestForex_Summary', methods=['GET'])
def backtestForex_Summary():
    bar = request.args.to_dict()
    t_Start = bar['t_Start']
    t_End = bar['t_End']
    Symbol = bar['Symbol']
    SLpips = bar['SLpips']
    balance = bar['balance']
    risk = bar['risk']
    return at.autotrade_OrderOnly(t_Start, t_End, Symbol, SLpips, balance, risk, token)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
