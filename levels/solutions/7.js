function init (vehicles, cities, passengers, game) {
	let v = vehicles[0];
	
	v.moveTo(['C','A','B','E','B','F', 'D']);
	
	v.on('visitCity', function(city) {
		if (city.passengers)
			v.load(city.passengers);
		if (city.id == 'D')
			v.unload();
	});
}