class Point {
  constructor(x, y, options) {
    this.pos = createVector(x, y);
    this.r = options.r || 10;
    this.colour = options.colour || "#FFF";
    this.distConstraint = options.distConstraint || 50;
    this.heading = 0;
  }

  setPos(pos) {
    this.pos.set(pos);
  }

  setHeading(heading) {
    this.heading = heading;
  }

  constrainedBy(other, isStrong = false) {
    const toMe = p5.Vector.sub(this.pos, other.pos);
    if (isStrong || toMe.mag() > other.distConstraint) {
      //   push();
      //   translate(other.pos.x, other.pos.y);
      //   noFill();
      //   stroke(other.colour);
      //   line(0, 0, toMe.x, toMe.y);
      //   pop();
      toMe.setMag(other.distConstraint);
      //   push();
      //   translate(other.pos.x, other.pos.y);
      //   noFill();
      //   stroke(other.colour);
      //   strokeWeight(4);
      //   line(0, 0, toMe.x, toMe.y);
      //   noStroke();
      //   fill(other.colour);
      //   circle(toMe.x, toMe.y, 10);
      //   pop();
      const newPos = p5.Vector.add(toMe, other.pos);
      this.pos.set(newPos);
      this.setHeading(toMe.mult(-1).heading());
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    noStroke();
    fill(this.colour);
    beginShape();
    vertex(this.r, 0);
    vertex(0, this.r);
    vertex(-this.r, 0);
    vertex(0, -this.r);
    endShape(CLOSE);
    arc(0, 0, 2 * this.r, 2 * this.r, radians(90), radians(270));
    pop();
  }

  showDistConstraint() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke(this.colour);
    circle(0, 0, 2 * this.distConstraint);
    pop();
  }
}
