var goog = {qty: 5, symbol: 'GOOG', name: 'Google Inc.', price: 4.50, amt: '0.45%', marketval: 4.25, marketprice: 4.25, lifetime: 100, pl: 5}
var apple = {qty: 5, symbol: 'APPL', name: 'Apple Inc.', price: 4.50, amt: '0.45%', marketval: 4.25, marketprice: 4.25, lifetime: 100, pl: 5}
var mystocks = [goog, apple];

angular.module('app.portfolio', [])

.controller('PortfolioController', function($scope, Portfolio){
	// MAKE A TRADE MODAL
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false

	$scope.chooseStock = function(){
		var stockName = $scope.stockInput;
		Portfolio.getStock(stockName).then(function(stock){
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
		});
		$scope.stockInput = "";
	}

	// Either buys a stock or sells it depending on selection
	$scope.performAction = function(){
		if ($scope.action === false){
			//buying a stock
			buy()
		} else {
			//Selling a stock
			sell()
		}
	}

	function buy(){
		console.log('buying the stock', $scope.stock);
	}

	function sell(){
		console.log('selling the stock', $scope.stock);
	}

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.stock.Ask;
		$scope.total = $scope.estPrice + $scope.fees;
	}


	// MY STOCKS MODAL
	$scope.stocks = mystocks;



})

.factory('Portfolio', function($http){

	// var getStocksByUserId = function(id){
	// 	return $http({
	// 		method: 'GET',
	// 		url: '/api/stocks/'+id
	// 	}).then(function(stocks){
	// 		return stocks;
	// 	})
	// }

	var buySell = function(options){
		return $http({
			method: 'POST',
			url: '/api/transactions',
			data: options
		}).then(function(data){
			return data;
		})
	}

  var getStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/'+stockName
    }).then(function(stock){
    	console.log(stock.data.query.results.quote)
    	return stock.data.query.results.quote;
    })
  }

  return {
  	getStock: getStock,
  	buySell: buySell
  }
})

