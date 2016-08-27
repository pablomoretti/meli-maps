var meli = require('./meli.js');
var Promise = require('promise');

var http = require('http');
var rest = require('restler');

console.log("longitude,latitude");

meli.search("MCO","riego").then(function(items){

	items.forEach(function(item){

		var location = item.seller_address;

		if(location.longitude && location.latitude){
			console.log(location.longitude + "," + location.latitude);
		}	

	});
});





