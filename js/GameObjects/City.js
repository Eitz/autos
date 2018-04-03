class City extends GameObject {

  constructor(props) {
    super(props);
    this.id = 'city-' + props.id;
    this.name = props.name;
    this.pos = new Vector2(props.x, props.y);
    this.size = 20;
    this.renderOrder = 2;
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
        cities.push(new City(o));
      }
      return cities;
    } else {
      return new City(object);
    }
  }
}