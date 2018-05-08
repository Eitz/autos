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

		this.log = new Logger(this.elements.event_log);
		this.log.debug("The game has loaded!");

		this.vehicles = [];
		this.cities = [];
		this.passengers = [];
		/** @const {number} */
		this.vehicleVelocity = 0.1;

		this.gameStats = new GameStats(this.elements.progress_buttons);

		game_instance = this;
	}

	static Instance() {
		return game_instance;
	}

	Setup() {
		this.events = new GameEventManager();
		this.controller = new GameController(this.elements.gameArea);
		this.LoadChallenge(this.GetLevelNumberFromHash());
		this.events.on('load-level', (levelNumber, level) => {
			this.log.debug(`The level (${levelNumber} - ${level.name}) has loaded!`);
			this.setProperties(levelNumber, level);
			this.controller.Prepare();
		});
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
			return;
		}
		try {
			this.gameCode.init(this.vehicles, this.cities);
		} catch (err) {
			this.Pause();
			let numbers = Util.GetErrorNumbers(err.stack);
			err = new ImplementationError(err, 'init', numbers.line, numbers.column);
      this.log.error(err);
		}
	}

	Pause() {
		this.controller.Pause();
	}

	// todo execute Setup() again with cached values
	Reset() {
		this.vehicles = [];
		this.cities = [];
		this.passengers = [];
		this.controller.Reset();
		this.gameStats = new GameStats(this.elements.progress_buttons);
		let level = new Level(this.currentLevelNumber);
		level.fromJSON(this.currentLevelCache);
		this.controller.Prepare();
	}

	LoadChallenge(levelNumber) {
		let level = new Level(levelNumber);
		Game.loadTextAsset(level.getURL(), (asset) => {
			this.currentLevelCache = asset;
			level.fromJSON(asset);
			this.events.trigger('load-level', [levelNumber, level]);
		});
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
			theme: "dracula",
			mode: "javascript",
			gutters: ["CodeMirror-lint-markers"],
			lint: {
				esversion: 6
			}
		});
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