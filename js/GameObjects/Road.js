class Road extends GameObject {

  constructor(props) {
    super(props);
    this.renderOrder = 1;
    this.id = 'road-' + props.id;
    let gameController = Game.Instance().controller;
    this.from = gameController.getCityById(props.from).pos;
    this.to = gameController.getCityById(props.to).pos;
  }

  static fromObject(object) {
    if (object && object.constructor == Array) {
      let roads = [];
      for (let o of object) {
        roads.push(new Road(o));
      }
      return roads;
    } else {
      return new Road(object);
    }
  }

  Render(ctx) {
    let city_size = 20;
    
    let padding = 0;

    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.setLineDash([]);
    ctx.moveTo(this.from.x+padding, this.from.y+padding);
    ctx.lineTo(this.to.x+padding, this.to.y+padding);
    ctx.strokeStyle = '#999';
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 9]);
    ctx.moveTo(this.from.x+padding, this.from.y+padding);
    ctx.lineTo(this.to.x+padding, this.to.y+padding);
    ctx.strokeStyle = '#FFF';
    ctx.stroke();    
  }
}