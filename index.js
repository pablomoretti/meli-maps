var meli = require('./meli.js');
var Promise = require('promise');

meli.search("MLA","fernet").then(function(items){
	items.forEach(function(item){
		 meli.getCity(item.address.city_id).then(function(data){
			var location = data.geo_information.location;
			console.log(location.longitude + "," + location.latitude);
		});
	});
});



