class RoadGO extends GameObject {

  constructor(props) {
    super(props);
    
    /** @const {number} */
    this.renderOrder = 1;
    
    /** @const {string} */
    this.id = props.id;
    
    /** @type {GameController} */
    let gameController = Autos.Instance().controller;
    
    /** @type {CityGO} */
    this.from = gameController.getCityById(props.from);
    
    /** @type {CityGO} */
    this.to = gameController.getCityById(props.to);

    /** @const {number} */
    this.dampering = props.dampering || 1;

    /** @const {number} */
    this.travelTime = this.GetTravelTime(Autos.Instance().vehicleVelocity);

    /** @type {City} */
    this.IEObject = new Road(this);
    
    this.shouldRenderInfo = !props.hideInfo;
    this.renderThisSide = true;
    this.singleRoad = true;

    this.from.addRoad(this.IEObject);
  }

  Prepare() {
    if (this.renderThisSide) {
      let game = Autos.Instance();
      let otherRoad = game.gameFunctions.GetRoadBetween(this.to.IEObject, this.from.IEObject);
      if (otherRoad) {
        otherRoad.__gameObject__.renderThisSide = false;
        otherRoad.__gameObject__.singleRoad = false;
        this.singleRoad = false;
      }
    }
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

    let rotate_from_city_x = 3*Math.cos(rotated_angle);
    let rotate_from_city_y = 3*Math.sin(rotated_angle);
    
    let move_from_city_x = 20*Math.cos(angle);
    let move_from_city_y = 20*Math.sin(angle);

    ctx.lineWidth = 13;
    ctx.moveTo(this.from.pos.x+rotate_from_city_x, this.from.pos.y+rotate_from_city_y);
    ctx.lineTo(this.to.pos.x+rotate_from_city_x, this.to.pos.y+rotate_from_city_y);
    ctx.setLineDash([]);

    let roadColor = '#faf8f5'

    ctx.strokeStyle = roadColor;
    ctx.stroke();    

    if (!this.singleRoad) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      ctx.moveTo(this.from.pos.x+move_from_city_x, this.from.pos.y+move_from_city_y);
      ctx.lineTo(this.to.pos.x-move_from_city_x, this.to.pos.y-move_from_city_y);
      ctx.strokeStyle = '#C2B8B2';
      ctx.stroke();
      ctx.setLineDash([]);
    }

    this.RenderArrowDirection(ctx, 3);
  }

  RenderTime(ctx, fontSize, x, y) {
    if (this.shouldRenderInfo && this.renderThisSide) {
      let t = this.GetTravelTime(Autos.Instance().vehicleVelocity) + "";
      t = t.replace('.00', '');
      
      let bold = '';
      if (this.dampering != 1) {
        bold = 'bold ';
      }
      
      ctx.font = `${bold}${fontSize}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#555';
      ctx.fillText(`${t}s`,x,y);
      
      ctx.font = `bold ${fontSize*.8}px Arial`;
      if (this.dampering < 1) {
        ctx.fillStyle = '#F66';
        ctx.fillText(`(${this.dampering}x)`,x,y+8);
      } else if (this.dampering > 1) {
        ctx.fillStyle = '#9F9';
        ctx.fillText(`(${this.dampering}x)`,x,y+8);
      }
      
      
      ctx.textBaseline = 'alphabetic'; 
      ctx.textAlign = 'left';
    }
  }

  RenderArrowDirection (ctx, r){

    var fromx = this.from.pos.x;
    var fromy = this.from.pos.y;
    
    var tox = this.to.pos.x;
    var toy = this.to.pos.y;

    let distance_from_line = this.singleRoad ? 3 : 5.5;
    
    let segments = 4;
    for (let i = 1; i<segments; i++) {
      
      let angle = Math.atan2(toy-fromy,tox-fromx);
      
      let degree_from_line = angle + 44.4 / Math.PI;
      
      var new_x = this.GetMiddlePointInSegment(i, segments).x + distance_from_line * Math.cos(degree_from_line)
      var new_y = this.GetMiddlePointInSegment(i, segments).y + distance_from_line * Math.sin(degree_from_line)

      var x_center = new_x;
      var y_center = new_y;

      var x;
      var y;

      let arrowColor = '#C2B8B2';//'#FFF';

      if (this.dampering < 1) {
        arrowColor = '#F99';
      } else if (this.dampering > 1) {
        arrowColor = '#6D6';
      }

      ctx.fillStyle = arrowColor;
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
      ctx.strokeStyle = arrowColor;
      ctx.beginPath();      
      ctx.lineWidth = 1;
      ctx.moveTo(x_center, y_center);
      angle = Math.atan2(fromy-toy,fromx-tox);
      x = r * 5 * Math.cos(angle) + x_center;
      y = r * 5 * Math.sin(angle) + y_center;
      ctx.lineTo(x, y);
      ctx.stroke();

      if (i == segments/2) {
        
        let bonusWidth = this.singleRoad ? 3 : 0;

        let x = this.GetMiddlePointInSegment(i, segments).x + (distance_from_line+bonusWidth) * 4.5 * Math.cos(degree_from_line)
        let y = this.GetMiddlePointInSegment(i, segments).y + (distance_from_line+bonusWidth) * 4 * Math.sin(degree_from_line)
        this.RenderTime(ctx, 10, x-2, y);
      }
    }
  }

  GetTravelTime(velocity) {
    /** @type {Vector2} */
    let a = this.from.pos;
    
    /** @type {Vector2} */
    let b = this.to.pos;

    return parseFloat((Math.hypot(b.x-a.x, b.y-a.y) / velocity / 1000 / this.dampering ).toFixed(2));
  }

  GetMiddlePointInSegment(n, nMax) {
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