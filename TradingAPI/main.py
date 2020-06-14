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

app = Flask(__name__)
CORS(app)
api = Api(app)

with open('cred.json') as f:
    data = json.load(f)

token = data['Credentials']['token']

######## OHLC DATA ###############


@app.route('/api/forex-ohlc', methods=['GET'])
def forexAPI():
    bar = request.args.to_dict()
    return FOHLC.forexOHLC(bar, token)


@app.route('/api/stock-ohlc', methods=['GET'])
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


@app.route('/comp-profile/<string:ticker>', methods=['GET'])
def compProfile(ticker):
    return cp.compProfile(ticker, token)

######## Stock prediction ###############


@app.route('/stock-predict/<string:tick>', methods=['GET'])
def get(tick):
    with app.app_context():
        return sp.get(tick)

#### Start of Web Scraping for Top 3 ###########


@app.route('/api/get-top-instruments', methods=['GET'])
def getTop3():
    return t3.getTop3()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
