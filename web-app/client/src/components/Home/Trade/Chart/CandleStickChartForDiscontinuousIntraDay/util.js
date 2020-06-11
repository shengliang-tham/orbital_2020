

import { tsvParse, csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";
import axios from 'axios'

function parseData(parse) {
    return function (d) {
        d.date = parse(d.date);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;

        return d;
    };
}

const parseDateTime = timeParse("%Y-%m-%d %H:%M:%S");

export function getData() {
    // const promiseIntraDayContinuous = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/bitfinex_xbtusd_1m.csv")
    //     .then(response => response.text())
    //     .then(data => csvParse(data, parseData(parseDateTime)))
    //     .then(data => {
    //         data.sort((a, b) => {
    //             return a.date.valueOf() - b.date.valueOf();
    //         });
    //         return data;
    //     });
    // return promiseIntraDayContinuous;

    // const promiseMSFT = fetch("http://localhost:8000/api/stockOHLC?ticker=Z74.SI&interval=D&startDate=1/06/2020&endDate=5/06/2020")
    //     .then(response => response.text())
    //     .then(data => console.log(data))
    //     .then(data => csvParse(data, parseData(parseDateTime)))
    // return promiseMSFT;

    const promiseMSFT = axios("http://localhost:8000/api/stockOHLC?ticker=Z74.SI&interval=D&startDate=1/06/2020&endDate=5/06/2020")
        // .then(response => response.text())
        // .then(data => console.log(data))
        .then(data => csvParse(data.data, parseData(parseDateTime)))
    return promiseMSFT;
}   
