
function init (vehicles, cities, passengers, game) {
	
	let cars = [];
	let bus;
	for (let v of vehicles) {
		if (v.type.name == 'Bus') {
			bus = v;
		} else {
			cars.push(v);
		}
	}
	
	cars[0].on('idle', (city) => {
		cars[0].moveTo(['C','F','G','H','E','A']);	
	});
	
	cars[1].on('idle', (city) => {
		cars[1].moveTo(['H','E','A', 'C','F','G']);	
	});
	
	bus.moveTo('D');
	bus.on('idle', (city) => {
		bus.moveTo(['G', 'D', 'B', 'A', 'B', 'D']);
	});
	
}