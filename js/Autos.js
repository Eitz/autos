let game_instance;

class Autos {

	constructor(root) {
		if (!root) {
			root = document;
		}
		this.elements = {
			description: root.getElementById('description'),
			progress_buttons: root.getElementById('progress-buttons'),
			gameArea: root.getElementById('game-area').getElementsByTagName('canvas')[0],
			event_log: root.getElementById('event-log'),
			code_editor: root.getElementById('code-editor'),
			short_documentation: root.getElementById('short-documentation-content'),
			buttons: {
				start: root.getElementById('btn-start'),
				reset: root.getElementById('btn-reset'),
				speed: root.getElementById('btns-speed').getElementsByTagName('button'),
			}
		};

		/** @const {number} */
		this.vehicleVelocity = 0.1;
		this.gameSpeed = 1;

		this.lastLevel = 10;

		game_instance = this;
		
		window.onhashchange = (e) => { 
			if (this.controller)
				this.controller.Stop();
			this.Setup();
 		};
	}

	static Instance() {
		return game_instance;
	}

	Setup(cachedChallenge) {

		this.elements.buttons.reset.classList.remove('primary');
		this.elements.buttons.start.disabled = false;
		this.elements.buttons.reset.disabled = true;
		this.elements.buttons.start.classList.add('primary');
		for (let btn of this.elements.buttons.speed) {
			btn.disabled = btn.classList.contains('primary');
		}
		
		this.vehicles = [];
		this.cities = [];
		this.passengers = [];

		let levelNumber = this.GetLevelNumberFromHash();

		if (levelNumber) {
			
			this.events = new GameEventManager();
			this.gameStats = new GameStats(this.elements.progress_buttons);
			this.log = new Logger(this.elements.event_log);
			this.controller = new GameController(this.elements.gameArea);
			this.gameFunctions = new Game(this);
			this.idGenerator = new IDGenerator();
			
			let level = this.LoadChallenge(levelNumber, cachedChallenge);
			
			if (!level) {
				this.events.on('load-level', (levelNumber, level) => {
					this.log.debug(`The level (${levelNumber} - ${level.name}) has loaded!`);
					this.setProperties(levelNumber, level);
					this.controller.SetConditions(level.conditions.victory, level.conditions.defeat);
					this.controller.SetLevel(level);
					this.editor.refresh();
					this.controller.Prepare();
				});
			} else {
				this.controller.SetConditions(level.conditions.victory, level.conditions.defeat);
				this.controller.SetLevel(level);
				this.editor.refresh();
				this.controller.Prepare();
			}
		}
	}

	IsHashOk() {
		let level = location.hash.replace('#', '');
		return !(!level || isNaN(level) || parseInt(level) > this.lastLevel || parseInt(level) < 1);
	}

	GetLevelNumberFromHash() {
		if (this.IsHashOk()) {
			let level = location.hash.replace('#', '');
			return parseInt(level);
		} else {
			location.hash = '1';
			return undefined;
		}
	}

	Start() {
		this.elements.buttons.reset.classList.remove('primary');
		this.elements.buttons.start.disabled = true;
		this.elements.buttons.reset.disabled = false;
		this.elements.buttons.start.classList.remove('primary');
		for (let btn of this.elements.buttons.speed) {
			btn.disabled = btn.classList.contains('primary');
		}		
		this.log.debug(`The game has started!`);
		this.controller.Start();
		let gameCode = this.GetCode();
		this.ParseGameCode(gameCode);
	}

	ParseGameCode(code) {
		this.gameCode = {};
		try {
			code = new Function ('{ try {' + code + '; return { init: init, update: (typeof update != \'undefined\') ? update : function(){} }} catch (err) { throw err; }}');
			this.gameCode = code();
		} catch(err) {
			this.Stop();
			err = new ImplementationError(err, undefined, err.lineNumber?err.lineNumber-2:undefined, err.columnNumber);
			this.log.error(err);
			Modals.showError(err.toString());
			return;
		}
		try {
			this.gameCode.init(this.vehicles, this.cities, this.passengers, this.gameFunctions);
		} catch (err) {
			this.Stop();
			let numbers = Util.GetErrorNumbers(err.stack);
			err = new ImplementationError(err, 'init', numbers.line, numbers.column);
			this.log.error(err);
			Modals.showError(err.toString());
		}
	}

	Next() {
		location.hash = this.currentLevelNumber+1;
	}

	Back() {
		location.hash = this.currentLevelNumber-1;
	}

	Pause(btn) {

		if (this.controller.isGameRunning) {
			// btn locking
			for (let b of this.elements.buttons.speed) {
				b.disabled = true;
				b.classList.remove('primary');
			}
			
			this.elements.buttons.reset.disabled = true;
			this.elements.buttons.start.classList.remove('primary');
			if (btn) {
				btn.classList.add('primary');
				btn.disabled = false;
				btn.innerHTML = "Unpause";
			}
			this.controller.Pause();
		}
		else {
			if (btn)
				btn.innerHTML = "Pause";
			this.elements.buttons.reset.disabled = false;
			this.SetSpeed(1, this.elements.buttons.speed[0]);
			this.controller.Unpause();
		}
	}


	Stop() {
		this.SetSpeed(1, this.elements.buttons.speed[0]);
		
		this.controller.Pause();
		this.elements.buttons.start.disabled = true;	
		
		this.elements.buttons.start.classList.remove('primary');
		for (let btn of this.elements.buttons.speed) {
			btn.disabled = true;
		}
		
		this.elements.buttons.reset.disabled = false;
		this.elements.buttons.reset.classList.add('primary');
	}

	SetSpeed(speed, btn) {
		for (let b of this.elements.buttons.speed) {
			b.disabled = false;
			b.classList.remove('primary');
		}
		btn.classList.add('primary');
		btn.disabled = true;
		this.gameSpeed = speed;
	}

	Reset() {
		this.elements.buttons.reset.classList.remove('primary');
		this.elements.buttons.start.disabled = false;
		this.elements.buttons.reset.disabled = true;
		this.elements.buttons.start.classList.add('primary');
		for (let btn of this.elements.buttons.speed) {
			btn.disabled = true;
		}		
		this.controller.Stop();
		this.Setup(this.cachedChallenge);
	}

	LoadChallenge(levelNumber, cachedChallenge) {
		let level = new Level(levelNumber);
		if (cachedChallenge && this.currentLevelNumber == levelNumber) {
			level.fromJSON(cachedChallenge);
			return level;
		} else {
			Autos.loadTextAsset(level.getURL(), (asset) => {
				this.cachedChallenge = asset;
				level.fromJSON(asset);
				this.events.trigger('load-level', [levelNumber, level]);
			});	
		}	
	}

	setProperties(levelNumber, level) {
		this.currentLevelNumber = levelNumber;
		this.setDescription(level.name, level.description);
		this.setCode(level.codeSample);
		this.setShortDocumentation(level.shortDocumentation);
	}

	setDescription(mapName, description) {
		let titleElement = this.elements.description.getElementsByTagName('h1')[0];
		let descriptionElement = this.elements.description.getElementsByTagName('h3')[0];

		titleElement.innerHTML = mapName;
		descriptionElement.innerHTML = description;
	}

	setCode(codeSample) {
		if (!this.editor) {
			this.elements.code_editor.innerHTML = codeSample;
			this.editor = CodeMirror.fromTextArea(this.elements.code_editor, {
				lineNumbers: true,
				theme: "duotone-light",
				mode: "javascript",
				indentWithTabs: true,
				gutters: ["CodeMirror-lint-markers"],
				lint: {
					esversion: 6,
					undef: true
				},
				tabSize: 4,
				indentUnit: 4
			});
			this.editor.setSize("100%", "100%");
		} else {
			this.editor.setValue(codeSample);
		}
	}

	GetCode() {
		return this.editor.getValue();
	}

	setShortDocumentation(shortDoc) {
		this.elements.short_documentation.innerHTML = shortDoc;
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