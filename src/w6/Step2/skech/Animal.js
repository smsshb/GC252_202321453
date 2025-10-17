class Animal {
  constructor(x, y, distConstraint, thickness = [40, 30]) {
    this.spine = [];
    this.head = null;
    push();
    colorMode(HSB, 360, 100, 100);
    for (let idx = 0; idx < thickness.length; idx++) {
      const posX = x;
      const posY = y + distConstraint * idx;
      const hue = map(idx, 0, thickness.length - 1, 0, 240);
      const colour = color(hue, 100, 100);
      const options = {
        colour: colour,
        distConstraint: distConstraint,
      };
      const newPoint = new Point(posX, posY, thickness[idx], options);
      if (idx === 0) {
        this.head = newPoint;
      }
      this.spine.push(newPoint);
    }
    pop();
    this.cwPoints = [];
    this.ccwPoints = [];
    this.headPoints = [];
  }

  setHeadPos(pos) {
    this.head.setPos(pos);
  }

  update() {
    this.spine.forEach((aPoint, idx) => {
      if (idx > 0) {
        aPoint.constrainedBy(this.spine[idx - 1], true);
      }
    });
    this.head.setHeading(this.spine[1].heading);

    this.spine.forEach((aPoint, idx) => {
      this.cwPoints[idx] = aPoint.getPointOnThickness(radians(90));
      this.ccwPoints[this.spine.length - 1 - idx] = aPoint.getPointOnThickness(
        radians(-90)
      );
    });

    this.headPoints[0] = this.head.getPointOnThickness(radians(-60));
    this.headPoints[1] = this.head.getPointOnThickness(radians(-30));
    this.headPoints[2] = this.head.getPointOnThickness(radians(30));
    this.headPoints[3] = this.head.getPointOnThickness(radians(60));
  }

  showSpine() {
    this.spine.forEach((aPoint) => {
      aPoint.show();
    });
  }

  showDistConstraint() {
    this.spine.forEach((aPoint) => {
      aPoint.showDistConstraint();
    });
  }

  showThickness() {
    this.spine.forEach((aPoint) => {
      aPoint.showThickness();
    });
  }

  showPtOnThicknessCW() {
    // this.spine.forEach((aPoint) => {
    //   const point = aPoint.getPointOnThickness(radians(90));
    //   push();
    //   translate(point.x, point.y);
    //   noStroke();
    //   fill("#F00");
    //   circle(0, 0, 8);
    //   pop();
    // });
    this.cwPoints.forEach((point) => {
      push();
      translate(point.x, point.y);
      noStroke();
      fill("#F00");
      circle(0, 0, 8);
      pop();
    });
  }

  showPtOnThicknessCCW() {
    // this.spine.forEach((aPoint) => {
    //   const point = aPoint.getPointOnThickness(radians(-90));
    //   push();
    //   translate(point.x, point.y);
    //   noStroke();
    //   fill("#00F");
    //   circle(0, 0, 8);
    //   pop();
    // });
    this.ccwPoints.forEach((point) => {
      push();
      translate(point.x, point.y);
      noStroke();
      fill("#00F");
      circle(0, 0, 8);
      pop();
    });
  }

  showBodyShape() {
    push();
    noStroke();
    fill("#0F0");
    beginShape();
    this.cwPoints.forEach((point) => {
      curveVertex(point.x, point.y);
    });
    this.ccwPoints.forEach((point) => {
      curveVertex(point.x, point.y);
    });
    this.headPoints.forEach((point) => {
      curveVertex(point.x, point.y);
    });
    endShape(CLOSE);
    pop();
  }

  showEyes() {
    push();
    translate(this.head.pos.x, this.head.pos.y);
    rotate(this.head.heading);
    noStroke();
    fill("#000");
    circle(0, 8, 5);
    circle(0, -8, 5);
    pop();
  }
}
