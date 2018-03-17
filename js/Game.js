class Game {

	Start(lvlNumber) {
		this.events = new GameEventManager();
		this.events.on('load-level', (levelNumber, map) => {
			this.setProperties(levelNumber, map);
		});
		this.startChallenge(lvlNumber || 1);
	}

	Update() {

	}

	startChallenge(roundNumber) {
		let map = new Map(roundNumber);
		Game.loadTextAsset(map.getURL(), (asset) => {
			map.fromXML(asset);
			this.events.trigger('load-level', [roundNumber, map]);
		});
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

	static loadTextAsset(uri, callback) {
		fetch(uri)
			.then((response) => {
				if (response.ok) {
					return response.text().then((body) => {
						callback(body);
					});
				} else {
					console.error(response);
					throw new Error("Response was not ok!");
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
}