class PassengerGO extends GameObject {

  constructor(props) {
    super(props);

    let game = Game.Instance();

    this.id = game.idGenerator.GetNext('passenger');
    
    let gameController = game.controller;

    this.fromCity = gameController.getCityById(props.from);
    this.toCity = gameController.getCityById(props.to);
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
        this.pos.x + offsetX + 7, this.pos.y - offsetY + 2.5
      );
    }
  }

  RenderInfo(ctx, fontSize, x, y) {
    ctx.font = `${fontSize}px Raleway`;
    ctx.fillText(`-> ${this.toCity.id}`,x,y);
  }

  Update(dt) {
    if (!this.onBoard)
      this.waitingTime += dt;
    else
      this.pos = new Vector2(this.onBoard.__gameObject__.pos.x, this.onBoard.__gameObject__.pos.y);
  }

  load(vehicleGO) {
    this.onBoard = vehicleGO.IEObject;
    this.fromCity.removePassenger(this.IEObject);
  }

  unload(city) {
    this.onBoard = undefined;
    if (city == this.toCity) {
      let game = Game.Instance();
      game.gameStats.addPassenger();
      game.controller.RemoveGameObject(this);
    } else {
      this.lastCity = city;
      city.addPassenger(this.IEObject);
      this.pos = new Vector2(city.pos.x, city.pos.y);
    }    
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