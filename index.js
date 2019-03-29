const express = require('express')
const path = require('path')
const axios = require('axios')
const PORT = process.env.PORT || 5000

var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

var yourApiKey = 'K66X37W9RVFUC4RQ';
var alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

const getStocks = async () => {
  try {
  	return axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact").then(dailyData => {
        	// console.log(dailyData.data['Time Series (Daily)'])
        	for (variable in dailyData.data['Time Series (Daily)']){
        		console.log (dailyData.data['Time Series (Daily)'][variable]['4. close']);
        		break;
        	}
        	})
  	} catch(error){
  		console.error(error)
  	}}

getStocks()

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))