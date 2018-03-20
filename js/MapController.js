class MapController {

  constructor(canvas) {
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} */
    this.ctx2D = this.canvas.getContext('2d');
    this.width  = this.canvas.width  = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
    
    // TODO: remove this
    this.color      = { background: '#EEE', ball: '#111' };
    this.size       = 20;
    this.x          = 30;
    this.y          = 30;
    this.dx         = 0.1;
    this.dy         = 0.1;
    this.maxx       = this.width  - this.size;
    this.maxy       = this.height - this.size;
  }

  Start (levelData) {
    requestAnimationFrame(this.Frame.bind(this));
  }

  Update (dt) {
    
    // TODO: remove later
    this.x = this.x + (this.dx * dt);
    this.y = this.y + (this.dy * dt);
  
    if ((this.dx < 0) && (this.x <= 0))
      this.dx = -this.dx;
    else if ((this.dx > 0) && (this.x >= this.maxx))
      this.dx = -this.dx;
  
    if ((this.dy < 0) && (this.y <= 0))
      this.dy = -this.dy;
    else if ((this.dy > 0) && (this.y >= this.maxy))
      this.dy = -this.dy;
  }

  Render() {
    
    this.ctx2D.save();
    this.ctx2D.fillStyle = this.color.background;
    this.ctx2D.fillRect(0, 0, this.width, this.height);
    
    // TODO: remove later
    this.ctx2D.fillStyle = this.color.ball;    
    this.ctx2D.fillRect(this.x, this.y, this.size, this.size);
    
    this.ctx2D.restore();
  }

  Frame(now) {  
    if (!this.last) {
      this.last = now;
    }
    this.Update(now-this.last);
    this.Render();
    this.last = now;
    requestAnimationFrame(this.Frame.bind(this));
  }
}