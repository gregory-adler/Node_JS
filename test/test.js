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
	    it('should return an array of saved values', function() {
	     let stockData = fs.readFileSync('./stocks.json');  
	     let stocks = JSON.parse(stockData);
	     console.log(stocks);
	     assert.equal((typeof stocks !== 'undefined' && stocks.length > 0), true)
	    });

	

  });
 })