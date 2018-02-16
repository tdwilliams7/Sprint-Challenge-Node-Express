const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
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
    .then(data => data.json())
    .then(data => {
      data = data.bpi;
      return (yesterdayPrice = data[yesterday]);
    })
    .catch(err => res.send(err));
};

const getCurrent = () => {
  return fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
    .then(data => data.json())
    .then(data => {
      return (currentPrice = data.bpi.USD.rate);
    })
    .catch(err => res.send(err));
};

app.get("/", (req, res) => {
  getCurrent().then(
    getYesterday().then(() => {
      console.log(Number(yesterdayPrice) - currentPrice);
      console.log(Number(currentPrice));
      console.log("Current num", currentPrice);
      console.log(currentPrice - yesterdayPrice);
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
