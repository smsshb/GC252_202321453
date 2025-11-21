class Point {
  constructor(x, y, thickness, options) {
    this.pos = createVector(x, y);
    this.r = options.r || 10;
    this.colour = options.colour || "#FFF";
    this.distConstraint = options.distConstraint || 50;
    this.heading = 0;
    this.thickness = thickness;
    this.angleConstraint = options.angleConstraint || [
      radians(150), //바라보는 최소 각도
      radians(210), //바라보는 최대 각도
    ];
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
      toMe.setMag(other.distConstraint);
      const newPos = p5.Vector.add(toMe, other.pos);
      this.pos.set(newPos);
      this.setHeading(toMe.mult(-1).heading());
    }
  }

  angleConstraninedBy(parent, grandParent) {
    const vecParentToMe = p5.Vector.sub(this.pos, parent.pos);
    const vecParentToGrandParent = p5.Vector.sub(grandParent.pos, parent.pos);
    let angle = p5.Vector.angleBetween(vecParentToMe, vecParentToGrandParent);

    //삼항연산자 : A = B ? C : D; 일 때 만약 A가 B라면 A를 C로 바꿔라, 그렇지 않다면 A를 D로 바꿔라
    //180도가 넘어가면 음수로 바뀌는데, 그걸 사용하기 편하게 360도로 사용하려고 씀 -179가 181도가 되도록
    angle = angle < 0 ? angle + 2 * Math.PI : angle;

    //객체구조분해할당
    let [minAngle, maxAngle] = this.angleConstraint;
    if (minAngle < 0) minAngle += 2 * Math.PI;
    if (maxAngle < 0) maxAngle += 2 * Math.PI;

    //머리 각도가 범위를 벗어나면
    if (angle < minAngle || angle > maxAngle) {
      const rotAngle = angle < minAngle ? -minAngle : -maxAngle;
      vecParentToGrandParent.rotate(rotAngle);
      // const newPos = vecParentToGrandParent.add(parent.pos); -> vecParentToGrandParent값 자체를 바꿔버림
      const newPos = p5.Vector.add(vecParentToGrandParent, parent.pos); //-> vecParentToGrandParent값은 그대로 두고 newPos만 새로운 벡터로 생성
      this.setPos(newPos);
      this.setHeading(vecParentToGrandParent.mult(-1).heading());
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

  showThickness() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke("#FFF");
    circle(0, 0, this.thickness);
    pop();
  }

  getPointOnThickness(angle, offset = 0, multiplier = 1) {
    const pointPos = p5.Vector.fromAngle(this.heading + angle);
    pointPos.setMag(multiplier * 0.5 * this.thickness + offset);
    pointPos.add(this.pos);
    return pointPos;
  }
}
