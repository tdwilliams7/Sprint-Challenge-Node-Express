const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const axios = require("axios");
const Moment = require("moment");

const app = express();
const PORT = 3030;
const yesterday = Moment()
  .subtract(1, "days")
  .format("YYYY-MM-DD");

let currentPrice;
let yesterdayPrice;

app.use(bodyParser.json());

const getYesterday = () => {
  return axios
    .get("https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday")
    .then(({ data }) => {
      data = data.bpi;
      yesterdayPrice = data[yesterday];
      console.log(yesterdayPrice);
    })
    .catch(err => res.send(err));
};

const getCurrent = (req, res) => {
  return axios
    .get("https://api.coindesk.com/v1/bpi/currentprice.json")
    .then(({ data }) => {
      currentPrice = data.bpi.USD.rate_float;
      console.log("float: ", currentPrice);
    })
    .catch(err => console.log(err));
};

app.get("/", (req, res) => {
  // getCurrent().then(
  //
  // )
  //getYesterday();
  getCurrent().then(
    getYesterday().then(() => {
      console.log(Number(yesterdayPrice));
      console.log(Number(currentPrice));
      console.log("Current num", currentPrice);
      const diff = currentPrice - yesterdayPrice;
      res.status(200).json(diff + "");
    })
  );
  // Promise.all(getCurrent(), getYesterday())
  //   .then(() => {
  //     console.log(currentPrice);
  //   })
  //   .catch(err => console.log(err));
});

app.listen(PORT, err => {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(`Listening on port: ${PORT}`);
});
