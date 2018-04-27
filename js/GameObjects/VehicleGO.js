class VehicleGO extends GameObject {
  constructor(props) {
    super(props);
    this.renderOrder = 3;
    this.id = props.id;
    this.type = props.type;
    this.startingCity =
      Game.Instance().controller.getCityById(props.city);
    this.pos = {
      x: this.startingCity.pos.x,
      y: this.startingCity.pos.y,
    };    
    this.speed = 0.1;
    this._travelTo = [];
    this.passengers = [];
    this.lastCity = this.startingCity;
    
    this.isIdle = false;

    this.IEObject = new Vehicle(this);
    Game.Instance().vehicles.push(this.IEObject);
  }

  static fromObject(object) {
    if (object && object.constructor == Array) {
      let roads = [];
      for (let o of object) {
        roads.push(new VehicleGO(o));
      }
      return roads;
    } else {
      return new VehicleGO(object);
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
    if (this._travelTo.length) {
      let city = this._travelTo[0];

      if (!this.lastCity.roads.map(road => road.to).includes(city.IEObject)) {
        if (city == this.lastCity) {
          Game.Instance().log.warning((`${this.IEObject} tried to <b>moveTo</b> a <c>City it already is in: '${this.lastCity.IEObject}'`)); 
        } else {
          Game.Instance().log.error(new CommandError(`${this.IEObject} recieved an unreachable <c>City</c> on <b>moveTo</b>: '${this.lastCity.IEObject}' -> '${city.IEObject}'`));
        }
        this._travelTo.shift();
        return;
      }
      this.isIdle = false;
      let dir = (new Vector2(city.pos.x - this.pos.x, city.pos.y - this.pos.y)).normalize();
      
      if (isNaN(dir.x) || isNaN(dir.y))
        return;
      
      this.pos = new Vector2(
        this.pos.x + dt * dir.x * this.speed,
        this.pos.y + dt * dir.y * this.speed
      );
      
      if (Math.abs(this.pos.x-city.pos.x) <= 1 && Math.abs(this.pos.y-city.pos.y) <= 1) {
        this.pos.x = city.pos.x;
        this.pos.y = city.pos.y;
        // ARRIVED
        this.lastCity = city;
        this.trigger('visitCity', [city.IEObject]);
        this._travelTo.shift();
      }
    } else {
      if (!this.isIdle) {
        this.isIdle = true;
        setTimeout(() => {
          if (this._travelTo.length == 0) {  
            console.log('IDLE');
            this.trigger('idle');
          }
        }, 10);
      }
    }
  }

  addPassenger(passenger) {
    if (passenger && passenger.constructor === Passenger) {
      passenger.gameObject.load(this);
      this.passengers.push(passenger);
      this.trigger('newPassenger', [passenger]);
    } else {
      Game.Instance().log.error(`${this.IEObject} tried to load an invalid passenger: '${passenger && passenger.IEObject ? passenger.IEObject : passenger}'`);
    }
  }

  removePassenger(passenger) {
    if (passenger) {
      passenger.gameObject.unload(this.lastCity);  
      this.passengers = this.passengers.filter(p => p !== passenger);
    } else {
      for (let p of this.passengers) {
        p.gameObject.unload(this.lastCity);
      }
      this.passengers = [];
    }    
  }

  /** @param City */
  goToCity(city) {
    this._travelTo.push(city);
  }

  /** Game Functions */
  moveToCityById(cities) {
    if (!cities.constructor === Array) {
      cities = [cities];
    }
    /** @type <GameController> */
    let gameController = Game.Instance().controller;
    for (let cityId of cities) {
      let city = gameController.getCityById(cityId);
      if (city)
        this.goToCity(city);
      else
        return false;
    }
    Game.Instance().log.debug(`${this.IEObject} updated target <c>City</c> to <b>moveTo</b>: '${this._travelTo.map((el => el.IEObject.toString())).join(',')}'`);
    return true;
  }
}