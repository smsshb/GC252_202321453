// ===== Chain.js =====

class Chain {
  constructor(origin, jointCount, linkSize, angleConstraint = TWO_PI) {
    this.joints = [];
    this.angles = [];
    this.linkSize = linkSize;
    this.angleConstraint = angleConstraint;

    this.joints.push(origin.copy());
    this.angles.push(0);

    for (let i = 1; i < jointCount; i++) {
      const prev = this.joints[i - 1];
      this.joints.push(p5.Vector.add(prev, createVector(0, this.linkSize)));
      this.angles.push(0);
    }
  }

  resolve(pos) {
    this.angles[0] = p5.Vector.sub(pos, this.joints[0]).heading();
    this.joints[0] = pos.copy();

    for (let i = 1; i < this.joints.length; i++) {
      const curAngle = p5.Vector.sub(
        this.joints[i - 1],
        this.joints[i]
      ).heading();
      this.angles[i] = constrainAngle(
        curAngle,
        this.angles[i - 1],
        this.angleConstraint
      );
      this.joints[i] = p5.Vector.sub(
        this.joints[i - 1],
        p5.Vector.fromAngle(this.angles[i]).setMag(this.linkSize)
      );
    }
  }

  fabrikResolve(pos, anchor) {
    this.joints[0] = pos.copy();
    for (let i = 1; i < this.joints.length; i++) {
      this.joints[i] = constrainDistance(
        this.joints[i],
        this.joints[i - 1],
        this.linkSize
      );
    }

    this.joints[this.joints.length - 1] = anchor.copy();
    for (let i = this.joints.length - 2; i >= 0; i--) {
      this.joints[i] = constrainDistance(
        this.joints[i],
        this.joints[i + 1],
        this.linkSize
      );
    }
  }

  display() {
    strokeWeight(8);
    stroke(255);

    for (let i = 0; i < this.joints.length - 1; i++) {
      const s = this.joints[i];
      const e = this.joints[i + 1];
      line(s.x, s.y, e.x, e.y);
    }

    fill(42, 44, 53);
    for (const j of this.joints) {
      ellipse(j.x, j.y, 32, 32);
    }
  }
}
