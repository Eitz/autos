class CityGO extends GameObject {

  constructor(props) {
    super(props);
    this.id = props.id;    
    this.name = props.name;
    this.pos = new Vector2(props.x, props.y);
    this.size = 25;
    this.renderOrder = 2;
    this.renderBottom = !!props.renderBottom;
    this.roads = [];
    this.passengers = [];
    this.vehicles = [];
    this.connectedCities = [];
    this.IEObject = new City(this);    
    Game.Instance().cities.push(this.IEObject);
  }

  Render(ctx) {
    let size = this.size;
    ctx.fillStyle = '#8A716A';
    ctx.fillRect(this.pos.x-size/2, this.pos.y-size/2, size, size);
    size -= 4;
    ctx.fillStyle = '#9A817A';
    ctx.fillRect(this.pos.x-size/2, this.pos.y-size/2, size, size);
    if (this.vehicles.length) {
      let i = 1;
      for (let v of this.vehicles) {
        v.Render(ctx, (this.renderBottom ? -1 : 1) * i++);
      }
    }
    if (this.passengers.length) {
      let i = 1;
      for (let p of this.passengers) {
        p.__gameObject__.Render(ctx, (this.renderBottom ? -1 : 1) * i++);
      }
    }
    
    this.RenderText(ctx);
  }

  RenderText(ctx) {
    ctx.font = `500 14px Raleway`;
    ctx.fillStyle = '#FFF';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    if (Game.Instance().controller.showCityIds) {
      ctx.fillText(this.id,this.pos.x,this.pos.y);
    } else {
      ctx.fillText('?',this.pos.x,this.pos.y);
    }
    ctx.textBaseline = 'alphabetic'; 
    ctx.textAlign = 'left';
  }

  Update(dt) {
    
  }

  addPassenger(passenger) {
    this.passengers.push(passenger);
    this.trigger('newPassenger', [passenger]);
  }

  removePassenger(passenger) {
    this.passengers = this.passengers.filter(p => p !== passenger);
  }

  AddVehicle(vehicle) {
    this.vehicles.push(vehicle);
  }

  RemoveVehicle(vehicle) {
    this.vehicles = this.vehicles.filter(v => v !== vehicle);
  }

  addRoad(road) {
    this.roads.push(road);
    this.connectedCities.push(road.to);
  }

  static fromObject(object) {
    if (object && object.constructor == Array) {
      let cities = [];
      for (let o of object) {
        cities.push(new CityGO(o));
      }
      return cities;
    } else {
      return new CityGO(object);
    }
  }  
}