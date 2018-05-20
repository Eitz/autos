function init (vehicles, cities, passengers, game) {
	let v = vehicles[0];
	let p = v.currentCity.passengers[0];
	v.load(p);
	let path = [];
	let startingCity = v.currentCity;
	let middleCities = startingCity.connectedCities;
	
	let t1 = util.GetTimeBetween(startingCity, middleCities[0]);
	let t2 = util.GetTimeBetween(startingCity, middleCities[1]);
	
	let middleCity;
	if (t1 < t2) {
		middleCity = middleCities[0];
	} else {
		middleCity = middleCities[1];
		
	}
	path.push(middleCity);
	let otherCities = middleCity.connectedCities;
	
	for (let c of otherCities) {
		if (c != startingCity && c != p.toCity) {
			path.push(c);
			break;
		}
	}
	path.push(p.toCity);
	
	v.moveTo(path);
	
	v.on('visitCity', function(city) {
		if (city == p.toCity) {
			v.unload(p);
		}
	});
	 
}