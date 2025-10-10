class Vehicle {
  constructor(x, y, maxSpeed = 5, maxForce = 0.1) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 20;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  show() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noFill();
    stroke(255);
    circle(0, 0, 2 * this.r);
    noStroke();
    fill(255);
    beginShape();
    vertex(0, 0);
    vertex(this.r * cos(radians(-160)), this.r * sin(radians(-160)));
    vertex(this.r * cos(radians(160)), this.r * sin(radians(160)));
    endShape(CLOSE);
    pop();
  }
}
