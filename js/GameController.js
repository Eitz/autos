class GameController {

  constructor(canvas) {
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} */
    this.ctx2D = this.canvas.getContext('2d');
    this.width  = this.canvas.width  = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
    this.backgroundColor = '#EEE';
    this.gameObjects = [];
    this.a = 0;
  }

  AddGameObject(gameObject) {
    this.gameObjects.push(gameObject);
  }

  RemoveGameObject(gameObject) {
    this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
  }

  ReorderGameObjects() {
    this.gameObjects = this.gameObjects.sort(function (a, b) {
      if (a.renderOrder < b.renderOrder)
        return -1;
      if (a.renderOrder > b.renderOrder)
          return 1;
      else
          return 0;
    });
    this.a++;
  }

  Start() {
    this.isGameRunning = true;
  }

  Pause() {
    this.isGameRunning = false;
  }

  Reset() {
    this.gameObjects = [];
    this.isGameRunning = false;
    this.reset = true;
  }

  Prepare (levelData) {
    this.ReorderGameObjects();
    requestAnimationFrame(this.Frame.bind(this));
  }

  Update (dt) {
    let game = Game.Instance();
    try {
      game.gameCode.update(dt, game.vehicles, game.cities);
    } catch(err) {
      err = new ImplementationError(err);
      console.error(err);
      game.log.error(err);
      // FIXME change to Stop
      this.Pause();
      return;
    }    
    for (let go of this.gameObjects) {
      go.Update(dt);
    }
    game.gameStats.addTime(dt);
  }

  Render() {
    
    this.ctx2D.save();
    this.ctx2D.fillStyle = this.backgroundColor;
    this.ctx2D.fillRect(0, 0, this.width, this.height);
    
    // Render here
    for (let go of this.gameObjects) {
      go.Render(this.ctx2D);
    }
    // End Render
    
    this.ctx2D.restore();
  }

  Frame(now) {  
    if (!this.last) {
      this.last = now;
    }
    if (this.isGameRunning) {
      this.Update(now-this.last);
    }
    this.Render();
    this.last = now;
    
    if (!this.reset)
      requestAnimationFrame(this.Frame.bind(this));
    else
      this.reset = false;    
  }

  getGameObjectByTypeAndId(type, id) {
    type += 'GO';
    for (let go of this.gameObjects) {
      if (go.constructor.name == type && go.id == id) {
        return go;
      }
    }
  }

  getCityById(id) {
    return this.getGameObjectByTypeAndId('City', id);
	}

	getVehicleById(id) {
		return this.getGameObjectByTypeAndId('Vehicle', id);
	}

	getRoadById(id) {
		return this.getGameObjectByTypeAndId('Road', id);
  }

  getPassengerById(id) {
		return this.getGameObjectByTypeAndId('Passenger', id);
  }
}