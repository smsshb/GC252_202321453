class Ball {
  pos;
  vel;
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = p5.Vector.random2D().setMag(speed);
  }

  init() {
    this.pos.set(width / 2, height / 2);
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
    if (this.pos.x < diameter / 2 || this.pos.x > width - diameter / 2) {
      this.pos.x =
        this.pos.x < diameter / 2 ? diameter / 2 : width - diameter / 2;
      this.vel.x *= -restitution;
    }
    if (this.pos.y < diameter / 2 || this.pos.y > height - diameter / 2) {
      this.pos.y =
        this.pos.y < diameter / 2 ? diameter / 2 : height - diameter / 2;
      this.vel.y *= -restitution;
    }
  }

  show() {
    noStroke();
    fill("skyblue");
    circle(this.pos.x, this.pos.y, diameter);
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
