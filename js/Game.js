let game_instance;

class Game {

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
			short_documentation: root.getElementById('short-documentation'),
		};

		/** @const {number} */
		this.vehicleVelocity = 0.1;

		game_instance = this;
	}

	static Instance() {
		return game_instance;
	}

	Setup(cachedChallenge) {
		
		this.vehicles = [];
		this.cities = [];
		this.passengers = [];
		
		this.events = new GameEventManager();
		this.gameStats = new GameStats(this.elements.progress_buttons);
		this.log = new Logger(this.elements.event_log);
		this.controller = new GameController(this.elements.gameArea);
		this.gameFunctions = new GameFunctions(this);
		
		this.LoadChallenge(this.GetLevelNumberFromHash(), cachedChallenge);
		
		if (!cachedChallenge) {
			this.events.on('load-level', (levelNumber, level) => {
				this.log.debug(`The level (${levelNumber} - ${level.name}) has loaded!`);
				this.setProperties(levelNumber, level);
				this.editor.refresh();
				this.controller.Prepare();
			});
		} else {
			this.editor.refresh();
			this.controller.Prepare();
		}
	}

	GetLevelNumberFromHash() {
		let level = location.hash.replace('#', '');
		console.log(level);
		if (!level || isNaN(level) || parseInt(level) > 5 || parseInt(level) < 1) {
			location.hash = "1";
			level = 1;
		}
		return parseInt(level);
	}

	Start() {
		this.log.debug(`The game has started!`);
		this.controller.Start();
		let gameCode = this.GetCode();
		this.ParseGameCode(gameCode);
	}

	ParseGameCode(code) {
		this.gameCode = {};
		try {
			code = new Function ('{ try {' + code + '; return { init: init, update: update }} catch (err) { throw err; }}');
			this.gameCode = code();
		} catch(err) {
			this.Pause();
			err = new ImplementationError(err, undefined, err.lineNumber?err.lineNumber-2:undefined, err.columnNumber);
			this.log.error(err);
			Modals.showError(err.toString());
			return;
		}
		try {
			this.gameCode.init(this.vehicles, this.cities, this.gameFunctions);
		} catch (err) {
			this.Pause();
			let numbers = Util.GetErrorNumbers(err.stack);
			err = new ImplementationError(err, 'init', numbers.line, numbers.column);
			this.log.error(err);
			Modals.showError(err.toString());
		}
	}

	Pause() {
		if (this.controller.isGameRunning)
			this.controller.Pause();
		else
			this.controller.Unpause();
	}

	Reset() {
		this.controller.Stop();
		this.Setup(this.cachedChallenge);
	}

	LoadChallenge(levelNumber, cachedChallenge) {
		let level = new Level(levelNumber);
		if (cachedChallenge) {
			level.fromJSON(cachedChallenge);
		} else {
			Game.loadTextAsset(level.getURL(), (asset) => {
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
		this.elements.code_editor.innerHTML = codeSample;
		/*
		ace.require("ace/ext/language_tools");
		this.editor = ace.edit("code-editor");
    this.editor.setTheme("ace/theme/monokai");
		this.editor.session.setMode("ace/mode/javascript");
		this.editor.renderer.setScrollMargin(10, 10);
		this.editor.setFontSize(16);
		this.editor.setOptions({
			enableBasicAutocompletion: true
		});
		*/
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