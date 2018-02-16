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
  return fetch(
    "https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday"
  )
    .then(response => response.json())
    .then(response => {
      yesterdayPrice = Number(response.bpi[yesterday]);
    })
    .catch(err => console.log(err));
};

const getCurrent = (req, res) => {
  return fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
    .then(response => response.json())
    .then(response => {
      currentPrice = response.bpi.USD.rate_float;
    })
    .catch(err => console.log(err));
};

app.get("/", (req, res) => {
  getCurrent().then(
    getYesterday().then(() => {
      const diff = currentPrice - yesterdayPrice;
      res.status(200).json(diff + "");
    })
  );
});

app.listen(PORT, err => {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(`Listening on port: ${PORT}`);
});
