class Ball {
  pos;
  vel;
  diameter;
  colour;
  // isMouseInside;
  isGrabbed;
  grabOffset; // 공의 중심을 잡지 않아도 자연스럽게 잡힘
  constructor(diameter, speed, colour) {
    this.pos = createVector(width / 2, height / 2);
    this.vel = p5.Vector.random2D().setMag(speed);
    this.diameter = diameter;
    this.colour = colour;
    // this.isMouseInside = false;
    this.isGrabbed = false;
    this.grabOffset = createVector(0, 0);
  }

  init(x, y, speed) {
    this.pos.set(x, y);
    const randomAngle = Math.random() * 360;
    this.vel.setHeading(radians(randomAngle));
    this.vel.setMag(speed);
  }

  drag(x, y) {
    //공 잡고 이동시키면
    this.pos.set(x, y);
    this.pos.add(this.grabOffset); //마우스 위치+공 중심과의 거리 위치가 유지되며 이동
  }

  applyGravity() {
    if (this.isGrabbed) return; //공 잡고 있을 때 계산X
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

  // setMouseInside(x, y) {
  //   const dx = x - this.pos.x;
  //   const dy = y - this.pos.y;
  //   // const distance = Math.sqrt(dx * dx + dy * dy);
  //   const distance = (dx ** 2 + dy ** 2) ** (1 / 2);
  //   this.isMouseInside = distance <= this.diameter / 2;
  // }

  isMouseInside(x, y) {
    const dx = x - this.pos.x;
    const dy = y - this.pos.y;
    const distance = (dx ** 2 + dy ** 2) ** (1 / 2);
    return distance <= this.diameter / 2;
  }

  grab(x, y) {
    //마우스로 잡으면
    this.grabOffset.set(this.pos); //중심을 잡지 않아도 위치 고정
    this.grabOffset.sub(x, y);
    this.vel.set(0, 0); //공 속도 정지
    this.isGrabbed = true; //잡힌 여부 true로
  }

  ungrab() {
    //마우스 놓으면
    this.isGrabbed = false; //다시 공에 중력, 속도계산 적용
  }

  show(isHovered) {
    if (isHovered) {
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
