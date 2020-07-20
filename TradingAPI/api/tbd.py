# -*- coding: utf-8 -*-
"""
Created on Sun Jul 19 15:05:25 2020

@author: User
"""
import websocket
import pandas as pd
Symbol ="EUR_JPY"
#
timeFrame = pd.DataFrame(columns=['Time','Price','Volume'])

class dataBLock():
    def __init__(self):
        self.timeFrame = pd.DataFrame(columns=['Time','Price','Volume'])
    
    def addTimeFrame(self,arr):
        self.timeFrame = self.timeFrame.append(arr, ignore_index=True)
        print(self.timeFrame)

a = dataBLock();

def on_message(ws, message):
    if "trade" in message:
        ## add into array
        ## convert into dataframe and convert
        print(message)
        print(type(message))
        price = message[message.index('"p":')+len('"p:"'):message.index(',"s"')]
        time = message[message.index('"t":')+len('"t:"'):message.index(',"v"')]
        volume = message[message.index('"v":')+len('"v:"'):message.index('}],')]
        arr = {'Price': price, 'Time': time[:-3], 'Volume': volume}
        a.addTimeFrame(arr)
        #pd.DataFrame(columns=['Time','Price','volume'])
        #rando = timeFrame.append({'Price': "'"+price+"'", 'Time': "'"+time[:-3]+"'", 'Volume': "'"+volume+"'"}, ignore_index=True)
        #print(rando)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    ws.send('{"type":"subscribe","symbol":"OANDA:'+Symbol+'"}')

def run(ws):
    ws.on_open = on_open
    ws.run_forever()

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://ws.finnhub.io?token=brcab6nrh5rap841ir30",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)

# timeFrame = autotrade("EUR_USD",8,3000,3,token) works
run(ws)
