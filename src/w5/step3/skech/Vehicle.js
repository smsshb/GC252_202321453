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
    // this.showAcc();
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  seek(target, factor = 1) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering.mult(factor));
  }

  separate(allVehicles, factor = 1) {
    const sum = createVector(0, 0);
    // let count = 0;
    allVehicles.forEach((aVehicle) => {
      if (aVehicle !== this) {
        const dist = p5.Vector.dist(this.pos, aVehicle.pos);
        if (dist > 0 && dist < this.r * 2) {
          const towardMe = p5.Vector.sub(this.pos, aVehicle.pos);
          towardMe.div(dist);
          sum.add(towardMe);
          // count++;
        }
      }
    });
    if (sum.mag() > 0) {
      // if (count > 0) {
      // sum.div(count);
      // const desired = sum.setMag(this.maxSpeed);
      // const steering = p5.Vector.sub(desired, this.vel);
      // steering.limit(this.maxForce);
      // this.applyForce(steering);
      // sum.div(count);
      sum.add(this.pos);
      this.seek(sum, factor);
    }
  }

  wrapCoordinates() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
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

  showVel() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke(0, 255, 0);
    line(0, 0, this.vel.x * 10, this.vel.y * 10);
    pop();
  }

  showAcc() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke(255, 0, 0);
    line(0, 0, this.acc.x * 1000, this.acc.y * 1000);
    pop();
  }
}
