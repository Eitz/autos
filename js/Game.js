class Game {

	Start(roundNumber) {
		this.startChallenge(roundNumber || 1);
		this.events = new GameEventManager();
		this.events.on('start', () => {
			console.log("xxx!");
		});
		this.events.trigger('start');
	}

	Update() {

	}

	startChallenge(roundNumber) {
		let map = new Map(roundNumber);
		this.setProperties(roundNumber, map);
	}

	setProperties(roundNumber, map) {
		this.currentRound = roundNumber;
		this.setMap(map.create());
		this.setDescription(map.name, map.description);
		this.setCode(map.codeSample);
		this.setShortDocumentation(map.shortDocumentation);
	}

	setMap(mapImage) {

	}

	setDescription(mapName, description) {

	}

	setCode(codeSample) {

	}

	setShortDocumentation(shortDoc) {

	}

	static loadAsset(uri, callback) {

	}
}