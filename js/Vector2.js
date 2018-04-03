class Vector2 {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    let length = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vector2(this.x / length, this.y / length);
  }
}