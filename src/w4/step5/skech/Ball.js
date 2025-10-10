class Ball {
  pos;
  vel;
  diameter;
  colour;
  isMouseInside;
  constructor(diameter, speed, colour) {
    this.pos = createVector(width / 2, height / 2);
    this.vel = p5.Vector.random2D().setMag(speed);
    this.diameter = diameter;
    this.colour = colour;
    this.isMouseInside = false;
  }

  init(x, y, speed) {
    this.pos.set(x, y);
    const randomAngle = Math.random() * 360;
    this.vel.setHeading(radians(randomAngle));
    this.vel.setMag(speed);
  }

  applyGravity() {
    this.vel.y += gravity;
  }

  update() {
    this.pos.add(this.vel);
  }

  resoveWallCollision() {
    if (
      this.pos.x < this.diameter / 2 ||
      this.pos.x > width - this.diameter / 2
    ) {
      this.pos.x =
        this.pos.x < this.diameter / 2
          ? this.diameter / 2
          : width - this.diameter / 2;
      this.vel.x *= -restitution;
    }
    if (
      this.pos.y < this.diameter / 2 ||
      this.pos.y > height - this.diameter / 2
    ) {
      this.pos.y =
        this.pos.y < this.diameter / 2
          ? this.diameter / 2
          : height - this.diameter / 2;
      this.vel.y *= -restitution;
    }
  }

  setMouseInside(x, y) {
    // 귀찮지만 가장 믿음직한 방법
    // const dx = x - this.pos.x;
    // const dy = y - this.pos.y;
    // const distance = Math.sqrt(dx * dx + dy * dy);
    // this.isMouseInside = distance <= this.diameter / 2;
    const distance = createVector(x, y).dist(this.pos);
    this.isMouseInside = distance <= this.diameter / 2;
  }

  show() {
    if (this.isMouseInside) {
      noFill();
      stroke(this.colour);
    } else {
      noStroke();
      fill(this.colour);
    }
    circle(this.pos.x, this.pos.y, this.diameter);
  }

  showDebug() {
    stroke("white");
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x + this.vel.x * 10,
      this.pos.y + this.vel.y * 10
    );
    stroke("red");
    line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 10, this.pos.y);
    stroke("green");
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.vel.y * 10);
  }
}
