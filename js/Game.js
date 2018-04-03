let game_instance;

class Game {

	constructor(root) {
		if (!root) {
			root = document;
		}
		this.elements = {
			description: root.getElementById('description'),
			progress_buttons: root.getElementById('progress-button'),
			gameArea: root.getElementById('gameArea').getElementsByTagName('canvas')[0],
			event_log: root.getElementById('event_log'),
			code_editor: root.getElementById('code_editor'),
			short_documentation: root.getElementById('short_documentation'),
		};
		
		game_instance = this;
	}

	static Instance() {
		return game_instance;
	}

	Start() {
		this.events = new GameEventManager();
		this.controller = new GameController(this.elements.gameArea);
		this.startChallenge(1);
		this.events.on('load-level', (levelNumber, level) => {
			// this.controller.Reset();
			this.setProperties(levelNumber, level);
			this.controller.Start();
		});
	}

	startChallenge(levelNumber) {
		let level = new Level(levelNumber);
		Game.loadTextAsset(level.getURL(), (asset) => {
			level.fromJSON(asset);
			this.events.trigger('load-level', [levelNumber, level]);
		});
	}

	setProperties(roundNumber, level) {
		this.currentRound = roundNumber;
		this.setDescription(level.name, level.description);
		this.setCode(level.codeSample);
		this.setShortDocumentation(level.shortDocumentation);
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