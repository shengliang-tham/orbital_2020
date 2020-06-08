from datetime import date, datetime, timedelta
import time
import requests
import datetime as dt
import pandas_datareader.data as pdr
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS

import json
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
import pandas as pd
pd.core.common.is_list_like = pd.api.types.is_list_like


app = Flask(__name__)
CORS(app)
api = Api(app)
token = 'brcab6nrh5rap841ir30'

####### Time conversion Unix #################


def unix_Date(ts):
    datetimeCURR = (datetime.utcfromtimestamp(
        ts) + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
    return datetimeCURR


def date_Unix(s):
    return int(time.mktime(dt.datetime.strptime(s, "%d/%m/%Y").timetuple()))
####### Time conversion Unix #################


##### Start of SciKit Learn Stock prediction #############
@app.route('/stockpredict/<string:tick>', methods=['GET'])
def get(tick):
    with app.app_context():
        # Get the stock data
        ticker = tick  # Insert stocks here
        Duration_from_today = dt.timedelta(days=365)
        # time delta converts numbers to date
        end_date = dt.date.today()
        # date today for todays date
        start_date = end_date - Duration_from_today
        # interval by default is set to day others are d,wk,mo
        data = pdr.get_data_yahoo(ticker, start_date, end_date, interval="d")
        # Take a look at the data
        # print(data) #will be using the adjusted head
        # Get adjusted Close Price
        df = data
        # Take a look at only ADJ close
        # print(df.head())

        # create a variable to state number of days to forecast
        forecast_out = 7  # predict the futute by how many days
        # Create another column (target gonna be shift base on forecast)

        df['Prediction'] = data['Adj Close'].shift(-forecast_out)
        # print out data seta
        # print(df.tail(4))
        # Create the independent data set(x)
        # xonvert the dataframe into a numpy array
        X = np.array(df.drop(['Prediction'], 1))
        # remove the last 'n' rows
        X = X[:-forecast_out]
        # print(X) #remove the NaN
        # Create the dependent data set (y)
        # convert the datagframe to a numpy array (all of the values including the NaN's)
        y = np.array(df['Prediction'])
        # Get all of the y values except for the last few rows
        y = y[:-forecast_out]
        # print(y)
        # split the the data into 80% training 20% testing
        x_train, x_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2)
        # Create and train the SVM (Regressor)
        svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
        svr_rbf.fit(x_train, y_train)
        # Testing Model: return the determination of
        # the training of the prediction closer to 1 the better
        svm_confidence = svr_rbf.score(x_test, y_test)
        ##print("svm confidence: ", svm_confidence)
        # Create and traing the linear regression model
        lr = LinearRegression()
        # train the model
        lr.fit(x_train, y_train)
        # Testing Model: return the determination of
        # the training of the prediction closer to 1 the better

        ####################### IMPORTANT LINEAR REGRESSION CONFIDENCE #########################
        lr_confidence = lr.score(x_test, y_test)
        # Set x_forecast equal to the last 30 rows of the original to the ADJ.CLose
        x_forecast = np.array(df.drop(['Prediction'], 1))[-forecast_out:]
        # print(x_forecast)
        # Print the linear progression model prediction for the next 'n' days
        lr_prediction = lr.predict(x_forecast)
        listArr = lr_prediction.tolist()
        # print(type(json.dumps(listArr)))
        # print(type(lr_confidence))
        ####################### IMPORTANT LINEAR REGRESSION CONFIDENCE #########################
        return jsonify({lr_confidence: json.dumps(listArr)})
##### End of SciKit Learn Stock prediction #############


##### Start of Forex OHLC DATA ###########
# Parameters:
# ticker - symbol should follow EUR_USD format
# interval - 1, 5, 15, 30, 60, D, W, M
# startDate - Follow dd/mm/yyyy format
# endDate - same  as start Date should be left blank if defaulted to today
@app.route('/api/forexOHLC', methods=['GET'])
def forexOHLC():
    bar = request.args.to_dict()
    Symbol = bar['ticker']
    resolution = str(bar['interval'])  # 1,5 etc etc
    t_Start = str(date_Unix(bar['startDate']))  # start time
    if len(bar['endDate']) == 0:
        t_End = str(int(time.time()))
    else:
        t_End = str(date_Unix(bar['endDate']))
    URL = 'https://finnhub.io/api/v1/forex/candle?symbol=OANDA:'+Symbol+'&resolution=' + \
        resolution+'&from='+t_Start+'&to='+t_End+'&token='+token+'&format=json'
    r = requests.get(URL)
    r_json = r.json()
    r_Open = np.array(r_json['o'])
    r_High = np.array(r_json['h'])
    r_Low = np.array(r_json['l'])
    r_Close = np.array(r_json['c'])
    r_time = np.array(r_json['t'])
    df2 = pd.DataFrame(r_time, columns=['Time'])
    df2['Time'] = df2['Time'].apply(lambda x: unix_Date(x))
    r_vol = np.array(r_json['v'])
    df = pd.DataFrame(r_Open, columns=['Open'])
    df['High'] = r_High
    df['Low'] = r_Low
    df['Close'] = r_Close
    df['Volume'] = r_vol
    df.index = df2['Time']
    df.index.names = ['Time']
    return df.to_csv(sep='\t')
    # return df.to_json()

##### End of Forex OHLC DATA ###########

##### Start of Stock OHLC DATA ###########
# Parameters:
# ticker - symbol should follow yahoo signals.
# interval - 1, 5, 15, 30, 60, D, W, M
# startDate - Follow dd/mm/yyyy format
# endDate - same  as start Date should be left blank if defaulted to today


@app.route('/api/stockOHLC', methods=['GET'])
def stockOHLC():
    bar = request.args.to_dict()
    Symbol = bar['ticker']
    resolution = str(bar['interval'])  # 1,5 etc etc
    t_Start = str(date_Unix(bar['startDate']))  # start time
    if len(bar['endDate']) == 0:
        t_End = str(int(time.time()))
    else:
        t_End = str(date_Unix(bar['endDate']))
    url = 'https://finnhub.io/api/v1/stock/candle?symbol='+Symbol + \
        '&resolution='+resolution+'&from='+t_Start+'&to='+t_End+'&token='+token
    r = requests.get(url)
    r_json = r.json()
    r_Open = np.array(r_json['o'])
    r_High = np.array(r_json['h'])
    r_Low = np.array(r_json['l'])
    r_Close = np.array(r_json['c'])
    r_time = np.array(r_json['t'])
    df2 = pd.DataFrame(r_time, columns=['Time'])
    df2['date'] = df2['Time'].apply(lambda x: unix_Date(x))
    r_vol = np.array(r_json['v'])
    df = pd.DataFrame(r_Open, columns=['open'])
    df['high'] = r_High
    df['low'] = r_Low
    df['close'] = r_Close
    df['volume'] = r_vol
    df.index = df2['date']
    df.index.names = ['date']
    return df.to_csv()
    # return df.to_csv(sep='\t')
    # return df.to_json(orient="records")
##### End of Stock OHLC DATA ###########

##### Start of Company Details and Price #######


@app.route('/compProfile/<string:ticker>', methods=['GET'])
def compProfile(ticker):
    r = requests.get(
        'https://finnhub.io/api/v1/stock/profile2?symbol='+ticker+'&token='+token)
    q = requests.get('https://finnhub.io/api/v1/stock/metric?symbol=' +
                     ticker+'&metric=all&token='+token)
    t = r.json()
    y = q.json()
    t.update(y['metric'])
    return json.dumps(t, indent=4)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
