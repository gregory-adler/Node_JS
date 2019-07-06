const assert = require('assert');
const fs = require ('fs')
require('../controller/apiController.js');


describe('Test1', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
		assert.equal([1, 2, 3].indexOf(4), -1);

		});

	

	});
	})

describe('Test2', function() {
	describe('#loadstocks()', function() {
		it('should return an array of saved stock values', function() {
			let stockData = fs.readFileSync('./stocks.json');
			let stocks = JSON.parse(stockData);
			assert.equal((typeof stocks !== 'undefined' && stocks.length > 0), true)
		});

	

	});
 })

describe('Test3', function() {
	describe('#loadcryptos()', function() {
		it('should return an array of saved crypto values', function() {
		let cryptoData = fs.readFileSync('./cryptos.json');  
		let cryptos = JSON.parse(cryptoData);
		assert.equal((typeof cryptos !== 'undefined' && cryptos.length > 0), true)
		});

	

	});
})