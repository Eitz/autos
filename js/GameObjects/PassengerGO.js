class PassengerGO extends GameObject {

  constructor(props) {
    super(props);

    this.id = 'passenger-' + props.id;
    
    let gameController = Game.Instance().controller;

    this.fromCity = gameController.getCityById(props.fromCity);
    this.toCity = gameController.getCityById(props.toCity);
    this.lastCity = this.fromCity;
    
    this.waitingTime = 0;
    this.pos = new Vector2(this.fromCity.pos.x, this.fromCity.pos.y);
    this.onBoard = undefined;

    /** Rendering */
    this.renderOrder = 5;
    this.size = 4;
    
    this.IEObject = new Passenger(this);
    this.fromCity.addPassenger(this.IEObject);
  }

  Render(ctx, offset) {
    if (offset) {
      let offsetY = offset ? offset * 15 + 10 : 0;
      let offsetX = offset ? 10 : 0;
      ctx.beginPath();
      ctx.fillStyle = '#3D348B';
      ctx.arc(this.pos.x + offsetX, this.pos.y - offsetY, this.size, 0, Math.PI * 2);
      ctx.fill();
      this.RenderInfo(
        ctx, 10,
        this.pos.x + offsetX + 6, this.pos.y - offsetY + 2.5
      );
    }
  }

  RenderInfo(ctx, fontSize, x, y) {
    ctx.font = `${fontSize}px Raleway`;
    ctx.fillStyle = '#555';
    ctx.fillText(`-> ${this.toCity.id}`,x,y);
  }

  Update(dt) {
    if (!this.onBoard)
      this.waitingTime += dt;
    else
      this.pos = this.onBoard.pos;
  }

  load(vehicleGO) {
    this.onBoard = vehicleGO;
    this.fromCity.removePassenger(this.IEObject);
  }

  unload(city) {
    this.onBoard = false;
    if (city == this.toCity) {
      let game = Game.Instance();
      game.gameStats.addPassenger();
      game.controller.RemoveGameObject(this);
    }
    this.pos = city.pos;
  }

  getWaitingTimeInSeconds() {
    return this.waitingTime / 1000;
  }

  static fromObject(object) {
    if (object && object.constructor == Array) {
      let passengers = [];
      for (let o of object) {
        passengers.push(new PassengerGO(o));
      }
      return passengers;
    } else {
      return new PassengerGO(object);
    }
  }
}