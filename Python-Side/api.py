from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import json
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
import pandas as pd
pd.core.common.is_list_like = pd.api.types.is_list_like
import pandas_datareader.data as pdr
import datetime as dt

app = Flask(__name__)
api = Api(app)

@app.route('/ticker/<string:tick>', methods=['GET'])
def get(tick):
    with app.app_context():
         #Get the stock data
        ticker = 'Z74.SI' #Insert stocks here
        Duration_from_today = dt.timedelta(days=365)
        # time delta converts numbers to date
        end_date = dt.date.today()
        #date today for todays date
        start_date = end_date - Duration_from_today
        #interval by default is set to day others are d,wk,mo 
        data = pdr.get_data_yahoo(ticker,start_date,end_date,interval = "d")
        
        
        #Take a look at the data
        ##print(data) #will be using the adjusted head
        #Get adjusted Close Price
        df = data
        #Take a look at only ADJ close
        #print(df.head())
        
        #create a variable to state number of days to forecast
        forecast_out = 7 #predict the futute by how many days
        #Create another column (target gonna be shift base on forecast)
        
        
        df['Prediction'] = data['Adj Close'].shift(-forecast_out)
        #print out data seta
        #print(df.tail(4))
        # Create the independent data set(x) 
        # xonvert the dataframe into a numpy array
        X = np.array(df.drop(['Prediction'],1))
        #remove the last 'n' rows
        X = X[:-forecast_out]
        #print(X) #remove the NaN
        ### Create the dependent data set (y)
        #convert the datagframe to a numpy array (all of the values including the NaN's)
        y = np.array(df['Prediction'])
        # Get all of the y values except for the last few rows
        y = y[:-forecast_out]
        #print(y)
        #split the the data into 80% training 20% testing
        x_train, x_test, y_train, y_test = train_test_split(X,y, test_size=0.2)
        # Create and train the SVM (Regressor)
        svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
        svr_rbf.fit(x_train,y_train)
        # Testing Model: return the determination of 
        #the training of the prediction closer to 1 the better
        svm_confidence = svr_rbf.score(x_test, y_test)
        ##print("svm confidence: ", svm_confidence)
        # Create and traing the linear regression model
        lr = LinearRegression()
        #train the model
        lr.fit(x_train, y_train)
        # Testing Model: return the determination of 
        #the training of the prediction closer to 1 the better
        
        ####################### IMPORTANT LINEAR REGRESSION CONFIDENCE #########################
        lr_confidence = lr.score(x_test, y_test)
        # Set x_forecast equal to the last 30 rows of the original to the ADJ.CLose
        x_forecast = np.array(df.drop(['Prediction'],1))[-forecast_out:]
        ##print(x_forecast)
        # Print the linear progression model prediction for the next 'n' days
        lr_prediction = lr.predict(x_forecast)
        listArr = lr_prediction.tolist()
        #print(type(json.dumps(listArr)))
        #print(type(lr_confidence))
        ####################### IMPORTANT LINEAR REGRESSION CONFIDENCE #########################
        return jsonify({lr_confidence: json.dumps(listArr)})


if __name__ == '__main__':
      app.run(host='0.0.0.0', port=8000)
