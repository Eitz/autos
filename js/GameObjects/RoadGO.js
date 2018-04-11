class RoadGO extends GameObject {

  constructor(props) {
    super(props);
    this.renderOrder = 1;
    this.id = 'road/' + props.id;
    let gameController = Game.Instance().controller;
    this.from = gameController.getCityById(props.from);
    this.to = gameController.getCityById(props.to);
  }

  static fromObject(object) {
    if (object && object.constructor == Array) {
      let roads = [];
      for (let o of object) {
        roads.push(new RoadGO(o));
      }
      return roads;
    } else {
      return new RoadGO(object);
    }
  }

  Render(ctx) {
    let city_size = 20;
    
    ctx.beginPath();
    
    ctx.setLineDash([]);
    

    let angle = 
      Math.atan2(
        this.to.pos.y-this.from.pos.y,
        this.to.pos.x-this.from.pos.x);

    let rotated_angle = angle + Math.PI/2;

    let rotate_from_city_x = 6*Math.cos(rotated_angle);
    let rotate_from_city_y = 6*Math.sin(rotated_angle);
    
    let move_from_city_x = 20*Math.cos(angle);
    let move_from_city_y = 20*Math.sin(angle);

    ctx.lineWidth = 12;
    ctx.moveTo(this.from.pos.x+rotate_from_city_x, this.from.pos.y+rotate_from_city_y);
    ctx.lineTo(this.to.pos.x+rotate_from_city_x, this.to.pos.y+rotate_from_city_y);
    ctx.setLineDash([]);
    ctx.strokeStyle = '#999';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.moveTo(this.from.pos.x+move_from_city_x, this.from.pos.y+move_from_city_y);
    ctx.lineTo(this.to.pos.x-move_from_city_x, this.to.pos.y-move_from_city_y);
    ctx.strokeStyle = '#FFF';
    ctx.stroke();
    ctx.setLineDash([]);

    this.RenderArrowDirection(ctx, 2.5);
  }

  RenderArrowDirection (ctx, r){

    var fromx = this.from.pos.x;
    var fromy = this.from.pos.y;
    
    var tox = this.to.pos.x;
    var toy = this.to.pos.y;

    let distance_from_line = 6.7;
    
    let segments = 4;
    for (let i = 1; i<segments; i++) {
      let angle = Math.atan2(toy-fromy,tox-fromx);
      let degree_from_line = angle + Math.PI/2;
      var new_x = this.getArrowPoint(i, segments).x + distance_from_line * Math.cos(degree_from_line)
      var new_y = this.getArrowPoint(i, segments).y + distance_from_line * Math.sin(degree_from_line)

      var x_center = new_x;
      var y_center = new_y;

      var x;
      var y;

      ctx.fillStyle = '#FFF'  
      ctx.beginPath();

      
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;

      ctx.moveTo(x, y);

      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;

      ctx.lineTo(x, y);

      angle += (1/3)*(2*Math.PI)
      x = r*Math.cos(angle) + x_center;
      y = r*Math.sin(angle) + y_center;

      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();

      // Ending line
      ctx.strokeStyle = '#FFF';
      ctx.beginPath();      
      ctx.lineWidth = 1;
      ctx.moveTo(x_center, y_center);
      angle = Math.atan2(fromy-toy,fromx-tox);
      x = r * 5 * Math.cos(angle) + x_center;
      y = r * 5 * Math.sin(angle) + y_center;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  getArrowPoint(n, nMax) {
    let t = n/nMax;
    
    let x1 = this.from.pos.x;
    let y1 = this.from.pos.y;
    let x2 = this.to.pos.x;
    let y2 = this.to.pos.y;

    return new Vector2(
      (1-t)*x1+t*x2,
      (1-t)*y1+t*y2
    );
  }
}