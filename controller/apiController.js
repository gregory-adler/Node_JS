const axios = require('axios')
const fs = require('fs');

// styles currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})


// styles time
let options = {  
	hour: "2-digit", minute: "2-digit" , second: "2-digit", hour12: true
};  


const getStocks= function (stocks, ticker){
	console.log ("stock controller")

	try {
		let conc_string = ''
		for (i=0; i< ticker.length; i++){
			if (i==ticker.length){
				conc_string= conc_string + ticker[i]
				continue
			}
			conc_string= conc_string + ticker[i] + ','
		}

		return axios.get(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${conc_string}&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact%27`).then(dailyData =>{

			// api overload
			if (dailyData.data['Note']){
				console.log("No Data - API requests")
				stocks= loadStocks()
				return stocks;
			}

			const today = new Date()

			let time = today.toLocaleTimeString("en-us", options); 
			
			for (i =0; i< dailyData.data['Stock Quotes'].length; i++){
				let symbol = (dailyData.data['Stock Quotes'][i][`1. symbol`])
				let value = formatter.format(dailyData.data['Stock Quotes'][i][`2. price`])
				stocks.push([symbol, value, time])

			}
			stocks.sort()
			// console.log(stocks)
			return stocks
		}
		)
	}
	catch(error){
		console.error(error)
	}

}

const getCryptos = function(cryptos){
	console.log ("crypto controller")

	try {
		return axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD`, 
			{'headers': { 
  				'X-CMC_PRO_API_KEY': 'b0417a80-7767-47ed-81f8-578f6345e7c8' 
  			} }).then(response =>{
  				// console.log(response.data.data)
  				const today = new Date()

				let time = today.toLocaleTimeString("en-us", options); 


				for (i =0; i<response.data.data.length; i++){
					// console.log(response.data.data)
					let symbol = (response.data.data[i]['symbol'])

					// skip usd tether
					if (symbol == 'USDT'){
						continue;
					}
					let rank = response.data.data[i]['cmc_rank']
					let value = formatter.format(response.data.data[i]['quote']['USD']['price'])
					let day = response.data.data[i]['quote']['USD']['percent_change_24h'].toFixed(2) + '%'
					let week = response.data.data[i]['quote']['USD']['percent_change_7d'].toFixed(2) + '%'
					let url = `/cryptocurrency-icons/svg/color/${symbol}.svg`
					cryptos.push([rank, symbol, value, url, day, week, time])
				}
				if (cryptos.length == 0){
					cryptos = loadCryptos()
					return cryptos
				}
				// console.log(cryptos)
				return cryptos
		}).catch(error =>{
				console.log("crypto api error")
  				cryptos = loadCryptos()
  				return cryptos
  			})

	} catch(error){
		console.error(error)
	}

}

const getAggregate = function(aggregates){
	console.log("aggregate controller")

	try{
		return axios.get(`https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest`, 
			{'headers': { 
  				'X-CMC_PRO_API_KEY': 'b0417a80-7767-47ed-81f8-578f6345e7c8' 
  			} }).then(response =>{
  				// console.log(response.data.data)

  				for (let property in response.data.data){
  					if (response.data.data.hasOwnProperty(property)){
  						// console.log (response.data.data[property])
  						if (property == 'quote' || property == 'last_updated'){
  							continue
  						}
  						aggregates.push([property, response.data.data[property]])
  					}
  				}

  				return aggregates

	}).catch(error =>{
				console.log("getAggregate api error")
				return 1
  			})

	} catch(error){
		console.error(error)
	}

	return 
}

const saveCryptos = async(cryptos) =>{
	await cryptos;
	const jsonContent = JSON.stringify(cryptos);

	fs.writeFile("./cryptos.json", jsonContent, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

    	console.log("The file was saved!");
	}); 
}

const saveStocks = async(stocks) =>{
	await stocks;
	const jsonContent = JSON.stringify(stocks);

	fs.writeFile("./stocks.json", jsonContent, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

    	console.log("The file was saved!");
	}); 
}

const loadStocks = async () => {
	let stockData = fs.readFileSync('./stocks.json');  
	let stocks = JSON.parse(stockData);
	console.log ("stocks loaded")
	return stocks
}


const loadCryptos = async () => {
	let cryptoData = fs.readFileSync('./cryptos.json');  
	let cryptos = JSON.parse(cryptoData);
	console.log ("cryptos loaded")
	// console.log(cryptos)
	return cryptos

}

const functionCaller = async () =>{
	let ticker = ['MSFT', 'NVDA', 'AAPL', 'GOOGL', 'AMD', 'SPOT', 'TSLA', 'NFLX', 'QCOM']
	let cryptos = []
	let aggregates = []
	let stocks = []
	let data = [3]
	cryptos = getCryptos(cryptos)
	aggregates = getAggregate(aggregates)
	stocks = getStocks(stocks, ticker)

	stocks.then(stocks => data[0]= stocks)
	cryptos.then(cryptos => data[1] = cryptos)
	aggregates.then(aggregates => data[2] = aggregates)
	await cryptos
	await stocks
	await aggregates
	return data

}


exports.getData = function (req, res){

	functionCaller().then(data => { 
		let stocks = data[0]
		let cryptos = data[1]
		let aggregate = data[2]
		res.render('pages/index', {stocks: stocks, cryptos: cryptos, aggregates: aggregate})
		saveStocks(stocks)
		saveCryptos(cryptos)
	})

}