class Moss {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.r = random(2, 3);
    this.maxSpeed = 0.05;
    this.maxForce = 0.05;
    this.visionRadius = 200;

    this.colour = "green";
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    const jitter = p5.Vector.random2D().mult(0.005);
    this.vel.add(jitter);

    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
  }

  wrapCoordinates() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  flock(others) {
    const sep = this.separation(others).mult(1.5);
    const ali = this.alignment(others).mult(1.0);
    const coh = this.cohesion(others).mult(0.8);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  separation(others) {
    const desiredSeparation = this.r * 2.5;
    const steer = createVector(0, 0);
    let count = 0;

    for (const o of others) {
      const d = this.pos.dist(o.pos);
      if (o !== this && d > 0 && d < desiredSeparation) {
        const diff = p5.Vector.sub(this.pos, o.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  alignment(others) {
    const neighbordist = this.r * 6;
    const sum = createVector(0, 0);
    let count = 0;
    for (const o of others) {
      const d = this.pos.dist(o.pos);
      if (o !== this && d > 0 && d < neighbordist) {
        sum.add(o.vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxSpeed);
      const steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    return createVector(0, 0);
  }

  cohesion(others) {
    const neighbordist = this.r * 6;
    const sum = createVector(0, 0);
    let count = 0;
    for (const o of others) {
      const d = this.pos.dist(o.pos);
      if (o !== this && d > 0 && d < neighbordist) {
        sum.add(o.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count); // 평균 위치
      return this.steerTo(sum);
    }
    return createVector(0, 0);
  }

  steerTo(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();

    // 메인 덩어리
    fill(80, 180, 90, 200);
    circle(0, 0, this.r * 2.2);

    // 주변에 작은 세포 덩어리 몇 개
    fill(100, 200, 110, 160);
    for (let i = 0; i < 3; i++) {
      const offset = p5.Vector.random2D().mult(this.r * 0.8);
      circle(offset.x, offset.y, this.r * 1.2);
    }

    pop();
  }
}
