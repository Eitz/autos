class GameController {

  constructor(canvas) {
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} */
    this.ctx2D = this.canvas.getContext('2d');
    this.width  = this.canvas.width  = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
    this.backgroundColor = '#C2B8B2';
    this.gameObjects = [];
    this.currentLevel = undefined;
    this.showCityIds = true;
  }

  AddGameObject(gameObject) {
    this.gameObjects.push(gameObject);
  }

  RemoveGameObject(gameObject) {
    this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
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
    this.showCityIds = true;
    for (let go of this.gameObjects) {
      go.Start();
    }
  }

  Pause() {
    this.isGameRunning = false;
    this.RenderPause();
  }

  RenderPause() {
    
    let sizeX = 120;
    let sizeY = 40;

    let pos = new Vector2(
      this.canvas.width/2, this.canvas.height/2
    );

    this.ctx2D.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx2D.fillRect(pos.x - sizeX/2 - 3, pos.y - sizeY/2-3, sizeX+6, sizeY+6);

    this.ctx2D.fillStyle = 'rgba(61,52,139, 0.6)';
    this.ctx2D.fillRect(pos.x - sizeX/2, pos.y - sizeY/2, sizeX, sizeY);

    this.ctx2D.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx2D.textAlign = 'center'
    this.ctx2D.font = 'bold 14px Arial';
    this.ctx2D.fillText("Game Paused", pos.x, pos.y+5);
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
    let game = Autos.Instance();
    dt *= game.gameSpeed;
    if (this.victoryCondition.function(game.vehicles, game.cities, game.passengers, game.gameFunctions)){
      
      if (game.lastLevel == game.currentLevelNumber)
        Modals.showEndModal();  
      else
        Modals.showVictory(this.victoryCondition.text);
      
      game.Stop();
    }

    if (this.defeatCondition.function(game.vehicles, game.cities, game.passengers, game.gameFunctions)) {
      Modals.showDefeat(this.defeatCondition.text);
      game.Stop();
    }

    try {
      game.gameCode.update(dt, game.vehicles, game.cities, game.passengers, game.gameFunctions);
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

  SetLevel(level) {
    this.currentLevel = level;
    this.AddGameObject(level);
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