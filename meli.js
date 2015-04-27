var http = require('http');
var rest = require('restler');
var Promise = require('promise');

var API_BASE = 'https://api.mercadolibre.com';

//http.globalAgent.maxSockets = 300

exports.getCity = function(cityId){
		return new Promise(function (resolve) {
			rest.get(API_BASE + '/cities/' + cityId,{timeout: 30000}).on('complete', function(data) {
				if(data.geo_information){
					resolve(data);
				}
			}).on('timeout', function(ms){

			})
		});
}

exports.search = function(site,query){

	var pTotal = new Promise(function (resolve) {
		rest.get( API_BASE + '/sites/' + site + '/search?q=' + query +'&limit=0').on('complete', function(data) {
			resolve(data.paging.total);
		});
	});


	var pResultsList = pTotal.then(function(total){

		var loops = (total / 200).toFixed();

		var resultsList = [];

		var pResults = null;

		for (var i = 0; i <= loops; i++) {

			pResults = new Promise(function (resolve) {
				rest.get(API_BASE + '/sites/' + site + '/search?q=' + query +'&limit=200&offset=' +  (i * 200) ).on('complete', function(data) {
					resolve(data.results.map(function(data){
						return data;
					}));
				});
			});

			resultsList.push(pResults);

		}
		
		return Promise.all(resultsList);
		
	}).then(function(data){

		var all = [];

		for (var i = 0; i < data.length; i++) {

			data[i] = data[i].filter(function(item){
				return item.address.city_id != ''
			});

			all = all.concat(data[i]);
		};

		return Promise.resolve(all);

	});

	return pResultsList;

}