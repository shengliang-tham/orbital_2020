from datetime import date, datetime, timedelta
import time
import requests
import datetime as dt
import pandas_datareader.data as pdr
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from bs4 import BeautifulSoup
import json
import numpy as np
import math
import decimal
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

####### Technical indcators ###############


def RSI(DF, n):
    df = DF.copy()
    df['delta'] = df['Close'] - df['Close'].shift(1)
    df['gain'] = np.where(df['delta'] > 0, df['delta'], 0)
    df['loss'] = np.where(df['delta'] < 0, abs(df['delta']), 0)
    avg_gain = []
    avg_loss = []
    gain = df['gain'].tolist()
    loss = df['loss'].tolist()
    for i in range(len(df)):
        if i < n:
            avg_gain.append(np.NaN)
            avg_loss.append(np.NaN)
        elif i == n:
            avg_gain.append(df['gain'].rolling(n).mean().tolist()[n])
            avg_loss.append(df['loss'].rolling(n).mean().tolist()[n])
        elif i > n:
            avg_gain.append(((n-1)*avg_gain[i-1] + gain[i])/n)
            avg_loss.append(((n-1)*avg_loss[i-1] + loss[i])/n)
    df['avg_gain'] = np.array(avg_gain)
    df['avg_loss'] = np.array(avg_loss)
    df['RS'] = df['avg_gain']/df['avg_loss']
    df['RSI'] = 100 - (100/(1+df['RS']))
    return df['RSI']
####### Technical indcators ###############

#### Start of Semi-Fix Data ###########


@app.route('/api/instrument-pool', methods=['GET'])
def instrumentPool():
    temp_dir = {}
    url = "https://sg.finance.yahoo.com/quote/%5ESTI/components?p=%5ESTI"
    page = requests.get(url)
    page_content = page.content
    # defining HTML Elements to look out for
    soup = BeautifulSoup(page_content, 'html.parser')
    tabl = soup.find_all(
        "table", {"class": "W(100%) M(0) BdB Bdc($finLightGray)"})
    for t in tabl:
        rows = t.find_all(
            "tr", {"class": "BdT Bdc($seperatorColor) Ta(end) Fz(s)"})
        for row in rows:
            if len(row.get_text(separator='|').split("|")[0:2]) > 1:
                # retrieve the symbol name in dictionary form
                temp_dir[row.get_text(separator='|').split(
                    "|")[0]] = row.get_text(separator='|').split("|")[1]
    df = pd.DataFrame.from_dict(temp_dir, orient='index')
    df.reset_index(inplace=True)
    df.columns = ["ticker", "ticker_name"]
    df["instrument"] = "stocks"

    # Forex
    df2 = pd.DataFrame([["EUR_USD", "EUR/USD", "forex"],
                        ["USD_JPY", "USD/JPY", "forex"],
                        ["GBP_USD", "GBP_USD", "forex"],
                        ["USD_CHF", "USD/CHF", "forex"]], columns=["ticker", "ticker_name", "instrument"])
    df = df.append(df2)
    return json.dumps(json.loads(df.to_json(orient='records')), indent=2)


@app.route('/api/time-pool', methods=['GET'])
def timePool():
    df2 = pd.DataFrame([["1 min", "1"],
                        ["5 min", "5"],
                        ["15 min", "15"],
                        ["30 min", "60"],
                        ["Daily", "D"],
                        ["Weekly", "W"],
                        ["Monthly", "M"]], columns=["display", "value"])
    return json.dumps(json.loads(df2.to_json(orient='records')), indent=2)

#### End of Semi-Fix Data ###########

#### Start of Web Scraping ###########


@app.route('/api/getTop3', methods=['GET'])
def getTop3():
    temp_dir = {}
    temp_dir2 = {}
    url = "https://sg.finance.yahoo.com/quote/%5ESTI/components?p=%5ESTI"
    page = requests.get(url)
    page_content = page.content
    # defining HTML Elements to look out for
    soup = BeautifulSoup(page_content, 'html.parser')
    tabl = soup.find_all(
        "table", {"class": "W(100%) M(0) BdB Bdc($finLightGray)"})
    for t in tabl:
        rows = t.find_all(
            "tr", {"class": "BdT Bdc($seperatorColor) Ta(end) Fz(s)"})
        for row in rows:
            if len(row.get_text(separator='|').split("|")[0:2]) > 1:
                # retrieve the symbol name in dictionary form
                temp_dir[row.get_text(separator='|').split(
                    "|")[0]] = row.get_text(separator='|').split("|")[1]
                # retrieve the percentage change
                temp_dir2[row.get_text(separator='|').split(
                    "|")[0]] = row.get_text(separator='|').split("|")[3]

    # converting data into pandas table format
    df = pd.DataFrame.from_dict(temp_dir, orient='index')
    df2 = pd.DataFrame.from_dict(temp_dir2, orient='index')
    df['change'] = df2[0]
    df.columns = ["name", "percentageChanged"]
    # converting negative percentages to postives
    df['percentageChangePos'] = df['percentageChanged'].apply(
        lambda x: math.sqrt(float(x)*float(x)))
    df['exchange'] = "STI"
    df.reset_index(drop=True, inplace=True)
    df2 = df
    # sort value based on biggest change
    df.sort_values(by=['percentageChangePos'], ascending=False, inplace=True)
    # drop once sorting is done
    del df['percentageChangePos']
    # only top 3 needed
    df2 = df.iloc[:3]
    # drop the current index which was the symbol and replaced it with a random number
    df2.reset_index(drop=True, inplace=True)
    # reset the index without adding the tickers into the frame as a coloumn
    df2.reset_index(level=0, inplace=False)
    df2['key'] = df2.index + 1
    # converting percentage change into decimal place
    df2['percentageChanged'] = df2['percentageChanged'].apply(
        lambda x: '{0:.2f}'.format(decimal.Decimal(x)))
    return json.dumps(json.loads(df2.to_json(orient='records')), indent=2)
#### End of Web Scraping ###########


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
    indicator = '&indicator=ema&timeperiod=20'
    URL = 'https://finnhub.io/api/v1/indicator?symbol=OANDA:'+Symbol+'&resolution=' + \
        resolution+'&from='+t_Start+'&to='+t_End+indicator+'&token='+token
    r = requests.get(URL)
    r_json = r.json()
    r_ema20 = np.array(r_json['ema'])  # hardcode stub to be replaced
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
    df['Date'] = df2['Time']
    df['ema20'] = r_ema20  # hardcode stub to be replace
    # df.index = df2['Time']
    # df.index.names = ['Time']
    #### indcators #######
    # RSI
    df['RSI'] = RSI(df, 14)
    # MACD
    # a = 12 ## fast period
    # b = 26 ## slow period
    # c = 9 ## signal period
    # df["MA_Fast"] = df["Close"].ewm(span=a, min_periods=a).mean()
    # df["MA_Slow"] = df["Close"].ewm(span=b, min_periods=b).mean()
    # df["MACD"] = df["MA_Fast"] - df["MA_Slow"]
    # df["Signal"] = df["MACD"].ewm(span=c,min_periods=c).mean()
    #### indcators ########
    return json.dumps(json.loads(df.to_json(orient='index')), indent=2)
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
