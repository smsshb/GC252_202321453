class Ball {
  pos;
  vel;
  acc; //가속도
  diameter;
  colour;
  constructor(x, y, diameter, colour, speed = [0.5, 3], angleRange = 45) {
    this.pos = createVector(x, y);
    let randomSpeed = random(speed[0], speed[1]);
    let randomAngle = -90 + random(-0.5 * angleRange, 0.5 * angleRange);
    this.vel = createVector(
      randomSpeed * cos(radians(randomAngle)),
      randomSpeed * sin(radians(randomAngle))
    );
    this.acc = createVector(0, 0);
    this.diameter = diameter;
    this.colour = colour;
  }

  applyGravity(gravity) {
    this.acc.add(gravity);
  }

  update() {
    this.vel.add(this.acc); // 속도+가속도 > 속도변화
    this.pos.add(this.vel); // 위치+속도 > 이동
    this.acc.set(0, 0);
  }

  show() {
    fill(this.colour);
    noStroke();
    circle(this.pos.x, this.pos.y, this.diameter);
  }

  isInsideCanvas() {
    return (
      this.pos.x > -0.5 * this.diameter &&
      this.pos.x < width + 0.5 * this.diameter &&
      this.pos.y > -0.5 * this.diameter &&
      this.pos.y < height + 0.5 * this.diameter
    );
  }
}
