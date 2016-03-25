
var app = angular.module('app')
app.controller('WatchlistController', ['$scope', '$http', 'symbolFactory', 'WatchlistFactory',  '$rootScope', '$location','$window', function($scope, $http, symbolFactory, WatchlistFactory,  $rootScope, $location,$window){

  $scope.watchlist = [];
  $scope.results =[];
  $scope.stock=[];

var userid = $window.localStorage.getItem('com.tp.userId');


$scope.isPositive = function (val){
  val = val.slice(0,-1);
  var result = parseFloat(val);
  if(result > 0) {
    return 'positive';
    }
    else {
      return 'negative';
    }  

}


$scope.openModal = function(){
  $('#modal1').openModal();
};

$scope.closeModal = function(){
  $('#modal1').closeModal();
};

$scope.reload = function(){
  $scope.getWatchlist();
}

$scope.getStock = function(stock){
 $scope.symbolResults=[];
 var filter =[];
 var symbol;
  symbolFactory.getCompany(stock).then(function(data){
    var sym = data.data.ResultSet.Result;
    for(var j=0;j<sym.length;j++){
       if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
         filter.push(sym[j]);
       }
    }
    if(!filter.length){
      Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000);
    }

    for(var i=0;i<filter.length;i++){
      $scope.symbolResults.push({'symbol' : filter[i].symbol, 'name': filter[i].name});
      }
    $scope.stockName = '';
  });

};


$scope.getWatchlist = function (){
    $scope.watchlist =[];
    $scope.results=[];

    function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }


  	WatchlistFactory.getWatchlist(userid)

  	.then(function (list){
      for(var stock in list.data){
        $scope.watchlist.push(stock);
      }

    WatchlistFactory.updateWatchlist($scope.watchlist)
    .then(function (stocks){

      stocks.data.pop()
      stocks.data.forEach(function(stock){

        stock.forEach(function(result){
          var result1 = result.replace(/\"/g,'');
          if(/[\%]/.test(result1)){
            result1 = result1.split('.')
            var res = result1[1].replace(/\%/,'')
            result1[1]= res
            var decimal = Math.round10(result1[1]);
            if(decimal <10){
              decimal = decimal * 10
            }
            var str =''
            result1[1]=str.concat(decimal +'%')
            result1 = result1.join('.')
          }
          else if(/[\-]/.test(result1)){
            var range = [];
            result1 = result1.split('-')
            result1.forEach(function(num){
              result1 = parseFloat(num).toFixed(2)
              range.push(result1)
            })
            result1 = range.join('-')
          }
          $scope.stock.push(result1)
        })

          $scope.results.push($scope.stock)
        $scope.stock=[];
      })
    })
  })
  }

  $scope.removeFromWatchlist = function (symbol){

    var userid = $window.localStorage.getItem('com.tp.userId');

    var data = {
      symbol: symbol,
      userid: userid
    }
    WatchlistFactory.removeFromWatchlist(data)
    .then(function(yo){
      Materialize.toast('Removed from Watchlist', 3000)
      $scope.getWatchlist();
    })
  }

$scope.stockSym = '';

  $scope.addStock = function (symbol){
    symbol = symbol.toUpperCase();
    $scope.userId = $window.localStorage.getItem('com.tp.userId');

    Materialize.toast('Watchlist Updated', 3000);
    WatchlistFactory.getWatchlist($scope.userId)
    .then(function (list){
      console.log(list,'list')
    })
    var data = {
      userid : $scope.userId,
      symbol : symbol
    }
  symbolFactory.addToWatchlist(data)
  .then(function(){
    $rootScope.$emit('addedToWatchlist')
  })
}



  $rootScope.$on('addedToWatchlist', function(){

    $scope.getWatchlist();
  });
  $scope.getWatchlist();
}])









