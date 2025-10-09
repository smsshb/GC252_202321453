class Ball {
  pos;
  vel;
  acc;
  width;
  height;
  angle;
  colour;
  constructor(x, y, area, colour, vel = createVector(0, 0)) {
    this.pos = createVector(x, y);
    this.vel = createVector(vel.x, vel.y);
    this.acc = createVector(0, 0);
    this.width = random(1, area);
    this.height = area / this.width;
    this.angle = random(360);
    this.colour = colour;
  }

  applyGravity(gravity) {
    this.acc.add(gravity);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(radians(this.angle));
    fill(this.colour);
    noStroke();
    rect(0 - 0.5 * this.width, 0 - 0.5 * this.height, this.width, this.height);
    pop();
  }

  isInsideCanvas() {
    return (
      this.pos.x > -2 * max(this.width, this.height) &&
      this.pos.x < width + 2 * max(this.width, this.height) &&
      this.pos.y > -2 * max(this.width, this.height) &&
      this.pos.y < height + 2 * max(this.width, this.height)
    );
  }
}
