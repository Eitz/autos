class Car extends GameObject {
  constructor(props) {
    super(props);
    this.renderOrder = 3;
    this.id = 'car-' + props.id;
    this.type = props.type;
    this.startingCity =
      Game.Instance().controller.getCityById(props.city);
    this.pos = {
      x: this.startingCity.pos.x,
      y: this.startingCity.pos.y,
    };    
    this.speed = 0.1;
  }

  static fromObject(object) {
    if (object && object.constructor == Array) {
      let roads = [];
      for (let o of object) {
        roads.push(new Car(o));
      }
      return roads;
    } else {
      return new Car(object);
    }
  }

  Render(ctx) {
    let radius = 5;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();  
  }

  Update(dt) {
    if (this._travelTo) {
      let dir = (new Vector2(this._travelTo.x - this.pos.x, this._travelTo.y - this.pos.y)).normalize();
      
      this.pos = new Vector2(
        this.pos.x + dt * dir.x * this.speed,
        this.pos.y + dt * dir.y * this.speed
      );
      
      if (parseInt(this.pos.x) == this._travelTo.x && parseInt(this.pos.y) == this._travelTo.y) {
        // ARRIVED
        this._travelTo = undefined;
      }
    }
  }

  /** @param Point */
  goToPosition(point) {
    this._travelTo = point;
  }

  /** Game Functions */
  moveToCity(city) {
    /** @type <GameController> */
    let gameController = Game.Instance().controller;
    city = gameController.getCityById(city);
    this.goToPosition(city.pos);
  }
}