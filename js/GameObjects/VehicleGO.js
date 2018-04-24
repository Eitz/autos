class VehicleGO extends GameObject {
  constructor(props) {
    super(props);
    this.renderOrder = 3;
    this.id = 'vehicle/' + props.id;
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

    this.vehicleIE = new Vehicle(this);
    Game.Instance().vehicles.push(this.vehicleIE);
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
        this.trigger('visitCity', [city.cityIE]);
        this._travelTo.shift();
        setTimeout(() => {
          if (this._travelTo.length == 0) {  
            console.log('IDLE');
            this.trigger('idle');
          }
        }, 50);        
      }
    }
  }

  addPassenger(passenger) {
    passenger._passengerGO.load(this);
    this.passengers.push(passenger);
    this.trigger('newPassenger', [passenger]);
  }

  removePassenger(passenger) {
    if (passenger) {
      passenger._passengerGO.unload(this.lastCity);  
      this.passengers = this.passengers.filter(p => p !== passenger);
    } else {
      for (let p of this.passengers) {
        p._passengerGO.unload(this.lastCity);
      }
      this.passengers = [];
    }    
  }

  /** @param City */
  goToCity(city) {
    this._travelTo.push(city);
  }

  /** Game Functions */
  moveToCityById(city) {
    console.log(city);
    console.log("Moving...");
    /** @type <GameController> */
    let gameController = Game.Instance().controller;
    if (city.constructor === Array) {
      for (let c of city) {
        this.goToCity(gameController.getCityById(c));
      }
    } else {
      this.goToCity(gameController.getCityById(city));
    }
  }
}