class Ball {
  pos;
  vel;
  diameter;
  colour;
  isGrabbed;
  grabOffset;
  constructor(diameter, speed, colour) {
    this.pos = createVector(width / 2, height / 2);
    this.vel = p5.Vector.random2D().setMag(speed);
    this.diameter = diameter;
    this.colour = colour;
    this.isGrabbed = false;
    this.grabOffset = createVector(0, 0);
  }

  init(x, y, speed) {
    this.pos.set(x, y);
    const randomAngle = Math.random() * 360;
    this.vel.setHeading(radians(randomAngle));
    this.vel.setMag(speed);
  }

  applyGravity() {
    if (this.isGrabbed) return;
    this.vel.y += gravity;
  }

  update() {
    if (this.isGrabbed) return;
    this.pos.add(this.vel);
  }

  resoveWallCollision() {
    if (this.isGrabbed) return;
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

  isMouseInside(x, y) {
    const dx = x - this.pos.x;
    const dy = y - this.pos.y;
    const distance = (dx ** 2 + dy ** 2) ** (1 / 2);
    return distance <= this.diameter / 2;
  }

  grab(x, y) {
    this.grabOffset.set(this.pos);
    this.grabOffset.sub(x, y);
    this.vel.set(0, 0);
    this.isGrabbed = true;
  }

  ungrab(vx, vy) {
    //마우스를 놓을 때
    this.vel.set(vx, vy); // vx, vy를 전달받고 this.vel (속도 벡터)에 저장 > 중력 및 이동 활성화
    this.isGrabbed = false;
  }

  drag(x, y) {
    this.pos.set(x, y);
    this.pos.add(this.grabOffset);
  }

  show(isHovered) {
    if (isHovered) {
      strokeWeight(1);
      noFill();
      stroke(this.colour);
    } else {
      strokeWeight(2);
      stroke(0);
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
