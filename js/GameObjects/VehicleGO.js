class VehicleGO extends GameObject {
  constructor(props) {
    super(props);

    let game = Autos.Instance();

    this.renderOrder = 1.5;

    this.id = game.idGenerator.GetNext('vehicle');
    
    this.type = this.GetVehicleTypeById(props.type);
    
    this.startingCity = game.controller.getCityById(props.city);
    
    this.pos = new Vector2(
      this.startingCity.pos.x,
      this.startingCity.pos.y,
    );

    this.realPos = this.pos;
    this.speed = game.vehicleVelocity;
    this._travelTo = [];
    this.passengers = [];
    this.lastCity = this.startingCity;
    this.currentCity = this.startingCity.IEObject;
    this.passengerCapacity = this.type.capacity;
    
    this.isIdle = true;
    this.firstRun = true;

    this.IEObject = new Vehicle(this);
    game.vehicles.push(this.IEObject);

    this.startingCity.AddVehicle(this);
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

    let size = this.type.size;
    let sizeX = size.x * 1.5;
    let sizeY = size.y;

    let modifierY = offset > 0 ? 15 : -5;

    let offsetY = offset ? offset * 15 + modifierY : 0;
    let offsetX = offset ? -28 : 0;
    ctx.fillStyle = this.type.color;
    
    if (offset && this._travelTo.length == 0) {
      ctx.fillRect(this.pos.x + offsetX, this.pos.y - offsetY, sizeX, sizeY);
      this.RenderInfo(
        ctx, 10,
        this.pos.x - (sizeX / 2) - 8 + offsetX, this.pos.y - offsetY + (offset ? 9 : 0)
      );
    } else if (this._travelTo[0]) {

      let city = this._travelTo[0];
      let road = Autos.Instance().gameFunctions.GetRoadBetween(this.lastCity.IEObject, city.IEObject);
      
      if (road) {
        road = road.__gameObject__;
        let toy = city.pos.y;
        let tox = city.pos.x;
        let fromy = this.lastCity.pos.y;
        let fromx = this.lastCity.pos.x;
        let deg = Math.atan2(toy-fromy,tox-fromx);

        this.pos = this.RenderInRightLane(new Vector2(tox, toy), road.singleRoad);

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(deg);
        ctx.fillRect(-sizeX/2, -sizeY/2, sizeX, sizeY);
        ctx.restore();
        
        this.RenderInfo(
          ctx, 10,
          this.pos.x - sizeX - 10, this.pos.y
        );
      }
    }
  }

  Update(dt) {
    if (this._travelTo.length) {
      this.currentCity = undefined;
      this.IEObject.currentCity = undefined;
      let city = this._travelTo[0];
      let road = Autos.Instance().gameFunctions.GetRoadBetween(this.lastCity.IEObject, city.IEObject);
      if (!road) {
        if (city == this.lastCity) {
          Autos.Instance().log.warning((`${this.IEObject} tried to <m c="Vehicle">moveTo</m> a <c>City</c> it already is in: '${this.lastCity.IEObject}'`)); 
        } else {
          Autos.Instance().log.error(new CommandError(`${this.IEObject} recieved an unreachable <c>City</c> on <m c="Vehicle">moveTo</m>: '${this.lastCity.IEObject}' -> '${city.IEObject}'`));
        }
        this._travelTo.shift();
        return;
      }

      this.lastCity.RemoveVehicle(this);
      this.isIdle = false;
      this.pos = this.realPos;
      
      let dir = (new Vector2(city.pos.x - this.pos.x, city.pos.y - this.pos.y)).normalize();
      
      if (isNaN(dir.x) || isNaN(dir.y))
        return;
      
      let distance = Math.hypot(this.realPos.x-city.pos.x, this.realPos.y-city.pos.y);
      let speed = this.speed;
      if (distance < 4) {
        speed /= 2;
      }

      this.realPos = new Vector2(
        this.pos.x + dt * dir.x * speed * road.dampering,
        this.pos.y + dt * dir.y * speed * road.dampering
      );

      if (distance < 2) {
        // ARRIVED
        this.ArriveCity(city);
      }
    } else {
      if (!this.isIdle || this.firstRun) {
        this.isIdle = true;
        setTimeout(() => {
          if (this._travelTo.length == 0) {  
            this.trigger('idle', [this.lastCity.IEObject]);
          }
        }, 1000);
      }
    }
    this.firstRun = false;
  }

  ArriveCity(city) {
    this.pos.x = city.pos.x;
    this.pos.y = city.pos.y;
    this.currentCity = city.IEObject;
    this.IEObject.currentCity = city.IEObject;
    city.AddVehicle(this);
    this._travelTo.shift();
    this.trigger('visitCity', [city.IEObject]);
    this.lastCity = city;
    this.IEObject.lastCity = city.IEObject;
    this.IEObject.currentRoute.shift();
  }

  GetVehicleTypeById(id) {
    for (let type in VehicleType) {
      if (VehicleType[type].id == id)
        return VehicleType[type];
    }
    return undefined;
  }

  /**
   * @param {Vector2} position
   * @param {Vector2} dir
  */
  RenderInRightLane(targetCityPos, singleRoad) {
    
    let angle = Math.atan2(
      targetCityPos.y - this.realPos.y,
      targetCityPos.x - this.realPos.x
    );
    
    let rotated_angle = angle + (2 * Math.PI / 8);
    let distance = singleRoad ? 5 : 7.5;

    return new Vector2(
      this.realPos.x + Math.cos(rotated_angle) * distance,
      this.realPos.y + Math.sin(rotated_angle) * distance,
    );
  }

  addPassenger(passenger) {
    if (!passenger || passenger.constructor !== Passenger) {
      let err = new CommandError(`${this.IEObject} tried to load an invalid passenger: '${passenger && passenger.IEObject ? passenger.IEObject : passenger}'`);
      Autos.Instance().log.error(err);
      return;
    }

    if (passenger.onBoard) {
      let err = new CommandError(`${this.IEObject} tried to load a passenger that is already on board a vehicle: '${passenger}' that is on ${passenger.onBoard}`);
      Autos.Instance().log.error(err);
      return;
    }

    if (this.passengers.length == this.passengerCapacity) {
      let err = new CommandError(`${this.IEObject} is full and can't load any more passengers! '${passenger}' from ${passenger.lastCity} is not going to board.`);
      Autos.Instance().log.error(err);
      return;
    }

    if (passenger.lastCity != this.currentCity) {
      let err = new CommandError(`${this.IEObject} tried to load a passenger that is not in this city: '${passenger}' from ${passenger.lastCity}`);
      Autos.Instance().log.error(err);
      return;
    }

    // everything ok!
    passenger.__gameObject__.load(this);
    this.passengers.push(passenger);
    this.trigger('loadPassenger', [passenger, this.currentCity]);
  }

  removePassenger(passenger) {
    if (passenger) {
      passenger.__gameObject__.unload(this.currentCity.__gameObject__);  
      this.passengers.splice(this.passengers.indexOf(passenger), 1);
    } else {
      for (let p of [...this.passengers]) {
        p.__gameObject__.unload(this.currentCity.__gameObject__);
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
    this.IEObject.currentRoute.push(city);
  }

  /** Autos Functions */
  moveToCityById(cities) {
    if (!cities.constructor === Array) {
      cities = [cities];
    }
    /** @type <GameController> */
    let gameController = Autos.Instance().controller;
    for (let cityId of cities) {
      let city = gameController.getCityById(cityId);
      if (city)
        this.goToCity(city);
      else
        return false;
    }
    Autos.Instance().log.debug(`${this.IEObject} updated target <c>City</c> to <m c="Vehicle">moveTo</m>: '${this._travelTo.map((el => el.IEObject.toString())).join(',')}'`);
    return true;
  }
}