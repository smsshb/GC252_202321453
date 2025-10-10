class Ball {
  pos;
  vel;
  diameter;
  colour;
  isGrabbbed;
  grabOffset;
  mass;
  acc;
  constructor(diameter, speed, colour) {
    this.pos = createVector(width / 2, height / 2);
    this.vel = p5.Vector.random2D().setMag(speed);
    this.diameter = diameter;
    this.colour = colour;
    this.isGrabbbed = false;
    this.grabOffset = createVector(0, 0);
    this.mass = Math.PI * (this.diameter / 2) ** 2;
    this.acc = createVector(0, 0);
  }

  init(x, y, speed) {
    this.pos.set(x, y);
    const randomAngle = Math.random() * 360;
    this.vel.setHeading(radians(randomAngle));
    this.vel.setMag(speed);
  }

  applyForce(force) {
    const appliedAcc = p5.Vector.div(force, this.mass);
    this.acc.add(appliedAcc);
  }

  applyGravity(gravity) {
    if (this.isGrabbbed) return;
    // this.vel.y += gravity;
    this.acc.add(gravity);
  }

  update() {
    if (this.isGrabbbed) return;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  resoveWallCollision() {
    if (this.isGrabbbed) return;
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

  resolveBallCollision(other) {
    const dist = p5.Vector.dist(this.pos, other.pos);
    const minDist = (this.diameter + other.diameter) / 2;
    if (dist < minDist) {
      // 위치 보정
      const toOtherVec = p5.Vector.sub(other.pos, this.pos);
      const diff = minDist - dist;
      const correctionVec = p5.Vector.setMag(toOtherVec, diff / 2);
      other.pos.add(correctionVec);
      this.pos.sub(correctionVec);

      const normalVec = p5.Vector.setMag(toOtherVec, 1);

      // 속도 보정
      const vx1Ref = normalVec.dot(this.vel);
      const vx2Ref = normalVec.dot(other.vel);

      const denominator = this.mass + other.mass;
      const vx1After =
        (vx1Ref * (this.mass - other.mass) + 2 * other.mass * vx2Ref) /
        denominator;
      const vx2After =
        (vx2Ref * (other.mass - this.mass) + 2 * this.mass * vx1Ref) /
        denominator;

      const vx1Vec = p5.Vector.mult(normalVec, vx1After);
      const vx2Vec = p5.Vector.mult(normalVec, vx2After);

      const tangentVec = p5.Vector.rotate(normalVec, Math.PI * 0.5);

      const vy1Ref = tangentVec.dot(this.vel);
      const vy2Ref = tangentVec.dot(other.vel);

      const vy1Vec = p5.Vector.mult(tangentVec, vy1Ref);
      const vy2Vec = p5.Vector.mult(tangentVec, vy2Ref);

      const newVel1 = p5.Vector.add(vx1Vec, vy1Vec);
      const newVel2 = p5.Vector.add(vx2Vec, vy2Vec);

      this.vel.set(newVel1);
      other.vel.set(newVel2);
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
    this.isGrabbbed = true;
  }

  ungrab(vx, vy) {
    this.vel.set(vx, vy);
    this.isGrabbbed = false;
  }

  drag(x, y) {
    this.pos.set(x, y);
    this.pos.add(this.grabOffset);
  }

  show(isHovered) {
    push();
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
    pop();
  }

  showDebug() {
    push();
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
    pop();
  }
}
