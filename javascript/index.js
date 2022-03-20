/**
 * @file
 * This javascript example prints the current price for bitcoin to the terminal
 */
const moment = require("moment");
const axios = require("axios");
const accounting = require("accounting");
const { object, string } = require("yup");

/**
 * Example Main function
 * Asynchronous wrapper that allows await syntax
 * https://www.youtube.com/watch?v=vn3tm0quoqE
 */
async function main() {
  /**
   * Log the date to the console using the moment package
   * https://momentjs.com/
   */
  console.log(moment().format("Do MMMM YYYY"));

  /**
   * Get the data from the public coinbase api
   * https://developers.coinbase.com/api/v2#prices
   */
  const baseUrl = "https://api.coinbase.com/v2/prices/buy?currency=GBP";
  const { status, data: result } = await axios.get(baseUrl);
  const { data } = result;

  /**
   * validate that the status is 200 (okay)
   * this show how to throw an error if something doesn't work
   */
  if (status !== 200) {
    throw Error("Failed to fetch the API");
  }

  /**
   * This is a yup schema to validate
   * the input from the coinbase api
   * https://github.com/jquense/yup
   */
  const CoinbaseSchema = object({
    base: string().oneOf(["BTC"]).required(),
    currency: string().oneOf(["GBP"]).required(),
    amount: string().required(),
  }).required();
  /**
   * validate that the data returned from the api fits the model
   * this is an asynchronous call that shows how to validate
   * and verify that the data from coinbase is good quality
   */
  await CoinbaseSchema.validate(data);

  /**
   * print the current price of bitcoin to the terminal
   * using the accounting package to nicely format the number
   * https://github.com/nashdot/accounting-js#readme
   */
  const { base, amount } = data;
  console.log(base, `${accounting.formatMoney(+amount, "£")}`);
}

// run the function and catch any errors
main().catch((e) => console.log(e));
