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

  Render(ctx) {
    if (!this.onBoard) {
      ctx.beginPath();
      ctx.fillStyle = '#9F86C0';
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);      
      /*let p1 = new Vector2(this.size * Math.cos(angle+0) + this.pos.x, this.size * Math.sin(angle+0) + this.pos.y);
      let p2 = new Vector2(this.size * Math.cos(angle+(1/3)*(2*Math.PI)) + this.pos.x, this.size * Math.sin(angle+(1/3)*(2*Math.PI)) + this.pos.y);
      let p3 = new Vector2(this.size * Math.cos(angle+(2/3)*(2*Math.PI)) + this.pos.x, this.size * Math.sin(angle+(2/3)*(2*Math.PI)) + this.pos.y);
      path.moveTo(p1.x, p1.y);
      path.lineTo(p2.x, p2.y);
      path.lineTo(p3.x, p3.y);*/
      ctx.fill();
    }
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