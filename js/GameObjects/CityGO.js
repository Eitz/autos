class CityGO extends GameObject {

  constructor(props) {
    super(props);
    this.id = 'city/' + props.id;
    this.name = props.name;
    this.pos = new Vector2(props.x, props.y);
    this.size = 25;
    this.renderOrder = 2;
    Game.Instance().cities.push(new City(this));
  }

  Render(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(this.pos.x-this.size/2, this.pos.y-this.size/2, this.size, this.size);
  }

  Update(dt) {
    
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