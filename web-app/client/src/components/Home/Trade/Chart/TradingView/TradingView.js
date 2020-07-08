import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';
import './TradingView.scss';

class TradingView extends Component {
    tradingRef = React.createRef();

    async componentDidMount() {
        this.tradingRef.appendChild(this.initialiseChart(this.props.instrument, this.props.timeframe));
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps)
        console.log(prevState)
        if (prevProps.instrument !== this.props.instrument || prevProps.timeframe !== this.props.timeframe) {
            this.tradingRef.appendChild(this.initialiseChart(this.props.instrument, this.props.timeframe));
        }
    }

    setTradingRef = element => {
        this.tradingRef = element;
    }

    initialiseChart = (instrument, timeframe) => {
        const script = document.createElement('script');
        script.innerHTML = `new window.TradingView.widget({
              "autosize":true,
              "symbol": "${instrument}",
              "interval": "${timeframe}",
              "timezone": "Asia/Singapore",
              "theme": "light",
              "style": "1",
              "locale": "en",
              "toolbar_bg": "#f1f3f6",
              "enable_publishing": false,
              "hide_top_toolbar": true,
              "hide_side_toolbar": false,
              "save_image": false,
              "details": true,
              "calendar": true,
              "studies": [
                "RSI@tv-basicstudies"
              ],
              "container_id": "tradingview_2d59c"
            })`
        return script;
    }

    render() {
        return (
            <div className="trading-view">

                <div className="tradingview-widget-container" ref={this.setTradingRef}>
                    <div id="tradingview_2d59c"></div>
                </div>
            </div>
        );
    }
}

export default TradingView;