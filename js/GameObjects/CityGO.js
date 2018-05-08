class CityGO extends GameObject {

  constructor(props) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.pos = new Vector2(props.x, props.y);
    this.size = 25;
    this.renderOrder = 2;
    this.roads = [];
    this.passengers = [];
    this.IEObject = new City(this);
    Game.Instance().cities.push(this.IEObject);
  }

  Render(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(this.pos.x-this.size/2, this.pos.y-this.size/2, this.size, this.size);
    let vehicles = this.VehiclesInCity();
    if (vehicles.length) {
      let i = 1;
      for (let v of vehicles) {
        v.Render(ctx, i++);
      }
    }
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

  addRoad(road) {
    this.roads.push(road);
  }

  VehiclesInCity() {
    return Game.Instance().controller.GetVehiclesInCity(this);
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