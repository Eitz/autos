class VehicleGO extends GameObject {
  constructor(props) {
    super(props);
    // tweak this while on city
    this.renderOrder = 1.5;
    this.id = props.id;
    this.type = this.GetVehicleTypeById(props.type);
    this.startingCity =
      Game.Instance().controller.getCityById(props.city);
    this.pos = {
      x: this.startingCity.pos.x,
      y: this.startingCity.pos.y,
    };
    this.realPos = this.pos;
    this.speed = Game.Instance().vehicleVelocity;
    this._travelTo = [];
    this.passengers = [];
    this.lastCity = this.startingCity;
    this.passengerCapacity = this.type.capacity;
    
    this.isIdle = true;
    this.firstRun = true;

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

  Render(ctx, offset) {
    // disable auto render to let city render by offset
    if (this.isIdle && !offset) {
      return;
    }

    let radius = 10;
    let offsetY = offset ? offset * 15 + 15 : 0;
    let offsetX = offset ? 5 : 0;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.rect(this.pos.x + offsetX, this.pos.y - offsetY, radius * 1.5, radius);
    ctx.fill();
    this.RenderInfo(
      ctx, 10,
      this.pos.x + 20 + offsetX, this.pos.y - (offset ? -5 : 15) - offsetY
    );
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
      this.pos = this.realPos;
      
      let dir = (new Vector2(city.pos.x - this.pos.x, city.pos.y - this.pos.y)).normalize();
      
      if (isNaN(dir.x) || isNaN(dir.y))
        return;
      
      this.realPos = new Vector2(
        this.pos.x + dt * dir.x * this.speed,
        this.pos.y + dt * dir.y * this.speed
      );

      this.pos = this.RenderInRightLane(city.pos);
      
      if (Math.abs(this.realPos.x-city.pos.x) <= 1 && Math.abs(this.realPos.y-city.pos.y) <= 1) {
        this.pos.x = city.pos.x;
        this.pos.y = city.pos.y;
        // ARRIVED
        this.lastCity = city;
        this.trigger('visitCity', [city.IEObject]);
        this._travelTo.shift();
      }
    } else {
      if (!this.isIdle || this.firstRun) {
        this.isIdle = true;
        setTimeout(() => {
          if (this._travelTo.length == 0) {  
            console.log('IDLE');
            this.trigger('idle');
          }
        }, 10);
      }
    }
    this.firstRun = false;
  }

  GetVehicleTypeById(id) {
    console.log(id);
    for (let type in VehicleType) {
      console.log(type);
      if (VehicleType[type].id == id)
        return VehicleType[type];
    }
    return undefined;
  }

  /**
   * @param {Vector2} position
   * @param {Vector2} dir
  */
  RenderInRightLane(targetCityPos) {
    let angle = Math.atan2(
      targetCityPos.y - this.realPos.y,
      targetCityPos.x - this.realPos.x
    );
    let rotated_angle = angle + Math.PI/2;
    let distance = 1;
    return new Vector2(
      this.realPos.x + Math.cos(rotated_angle) * distance,
      this.realPos.y + Math.sin(rotated_angle) * distance,
    );
  }

  addPassenger(passenger) {
    if (passenger && passenger.constructor === Passenger) {
      passenger.__gameObject__.load(this);
      this.passengers.push(passenger);
      this.trigger('newPassenger', [passenger]);
    } else {
      Game.Instance().log.error(`${this.IEObject} tried to load an invalid passenger: '${passenger && passenger.IEObject ? passenger.IEObject : passenger}'`);
    }
  }

  removePassenger(passenger) {
    if (passenger) {
      passenger.__gameObject__.unload(this.lastCity);  
      this.passengers = this.passengers.filter(p => p !== passenger);
    } else {
      for (let p of this.passengers) {
        p.__gameObject__.unload(this.lastCity);
      }
      this.passengers = [];
    }    
  }

  RenderInfo(ctx, fontSize, x, y) {
    let p = this.passengers.length;
    let pMax = this.passengerCapacity;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = '#555';
    ctx.fillText(`${p}/${pMax}`,x,y);
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