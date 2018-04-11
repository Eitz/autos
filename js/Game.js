let game_instance;

class Game {

	constructor(root) {
		if (!root) {
			root = document;
		}
		this.elements = {
			description: root.getElementById('description'),
			progress_buttons: root.getElementById('progress-button'),
			gameArea: root.getElementById('game-area').getElementsByTagName('canvas')[0],
			event_log: root.getElementById('event-log'),
			code_editor: root.getElementById('code-editor'),
			short_documentation: root.getElementById('short-documentation'),
		};

		this.log = new Logger(this.elements.event_log);
		this.log.success("The game has started!");

		this.vehicles = [];
		this.cities = [];
		this.passengers = [];

		game_instance = this;
	}

	static Instance() {
		return game_instance;
	}

	Setup() {
		this.events = new GameEventManager();
		this.controller = new GameController(this.elements.gameArea);
		this.LoadChallenge(1);
		this.events.on('load-level', (levelNumber, level) => {
			this.setProperties(levelNumber, level);
			this.controller.Prepare();
		});
	}

	Start() {
		this.controller.Start();
		let gameCode = this.GetCode();
		this.ParseGameCode(gameCode);
	}

	ParseGameCode(code) {
		let gameCodeEval = {};
		try {
			gameCodeEval = eval('(' + code + ')');
		} catch(err) {
			this.Pause();
			this.log.error(err);
		}
		try {
			gameCodeEval.init(this.vehicles, this.cities);
		} catch (err) {
			this.Pause();
			this.log.error(err);
		}
	}

	Pause() {
		this.controller.Pause();
	}

	Reset() {
		this.vehicles = [];
		this.cities = [];
		this.passengers = [];
		this.controller.Reset();
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
			mode: "javascript"
		});
	}

	GetCode() {
		this.log.debug(this.editor.getValue());
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