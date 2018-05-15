class GameController {

  constructor(canvas) {
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} */
    this.ctx2D = this.canvas.getContext('2d');
    this.width  = this.canvas.width  = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
    this.backgroundColor = '#C2B8B2';
    this.gameObjects = [];
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
  }

  Start() {
    this.isGameRunning = true;
    for (let go of this.gameObjects) {
      go.Start();
    }
  }

  Pause() {
    this.isGameRunning = false;
  }

  Unpause() {
    this.isGameRunning = true;
  }

  Stop() {
    this.gameObjects = [];
    this.isGameRunning = false;
    this.stop = true;
  }

  Prepare (levelData) {
    this.ReorderGameObjects();
    for (let go of this.gameObjects) {
      go.Prepare();
    }
    requestAnimationFrame(this.Frame.bind(this));
  }

  Update (dt) {
    let game = Game.Instance();
    if(this.victoryCondition.function(game.vehicles, game.cities, game.gameStats)){
      Modals.showVictory(this.victoryCondition.text);
      this.Pause();
    }

    if (this.defeatCondition.function(game.vehicles, game.cities, game.gameStats)) {
      Modals.showDefeat(this.defeatCondition.text);
      this.Pause();
    }

    try {
      game.gameCode.update(dt, game.vehicles, game.cities);
    } catch(err) {
      err = new ImplementationError(err);
      game.log.error(err);
      this.Stop();
      Modals.showError(err.toString());
      return;
    }    
    for (let go of this.gameObjects) {
      go.Update(dt);
    }
    game.gameStats.addTime(dt);
  }

  Render() {
    
    this.ctx2D.fillStyle = this.backgroundColor;
    this.ctx2D.fillRect(0, 0, this.width, this.height);
    
    // Render here
    for (let go of this.gameObjects) {
      go.Render(this.ctx2D);
    }
    // End Render
    
  }

  Frame(now) {  
    if (!this.last) {
      this.last = now;
      this.Render();
    }
    if (this.isGameRunning) {
      this.Update(now-this.last);
      this.Render();
    }    
    
    this.last = now;
    
    if (!this.stop)
      requestAnimationFrame(this.Frame.bind(this));
  }

  getGameObjectByTypeAndId(type, id) {
    type += 'GO';
    for (let go of this.gameObjects) {
      if (go.constructor.name == type && go.id == id) {
        return go;
      }
    }
  }

  GetVehiclesInCity(cityGO) {
    let vehicles = [];
    for (let go of this.gameObjects) {
      if (go.constructor.name == 'VehicleGO' && go.pos.x == cityGO.pos.x && go.pos.y == cityGO.pos.y) {
        vehicles.push(go);
      }
    }
    return vehicles;
  }

  SetConditions(victory, defeat) {
    this.victoryCondition = {
      text: victory.text,
      function: victory.function
    };
    this.defeatCondition = {
      text: defeat.text,
      function: defeat.function
    };
  }

  /** @returns {CityGO} */
  getCityById(id) {
    return this.getGameObjectByTypeAndId('City', id);
	}

  /** @returns {VehicleGO} */
	getVehicleById(id) {
		return this.getGameObjectByTypeAndId('Vehicle', id);
	}

  /** @returns {RoadGO} */
	getRoadById(id) {
		return this.getGameObjectByTypeAndId('Road', id);
  }

  /** @returns {PassengerGO} */
  getPassengerById(id) {
		return this.getGameObjectByTypeAndId('Passenger', id);
  }
}