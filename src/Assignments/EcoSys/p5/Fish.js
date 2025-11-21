class Fish {
  constructor(baseSize, stripeHexColor, shapeOptions = {}) {
    this.mainColor = stripeHexColor ? color(stripeHexColor) : color("#FF4E33");
    this.transparency = 255;

    // 모양 옵션
    const BW = shapeOptions.bodyWidthMultiplier || 4;
    const BH = shapeOptions.bodyHeightMultiplier || 0.3;
    const BH_ADD = shapeOptions.bodyHeightOffset || 5;
    const TW = shapeOptions.tailWidthMultiplier || 0.6;
    const TH = shapeOptions.tailHeightMultiplier || 0.25;

    //눈
    this.eyeSizeMultiplier = shapeOptions.eyeSizeMultiplier || 1.0;

    //샥스핀
    this.hasDorsalFin = shapeOptions.hasDorsalFin || false;
    this.dorsalWidthMultiplier = shapeOptions.dorsalWidthMultiplier || 0.4;
    this.dorsalHeightMultiplier = shapeOptions.dorsalHeightMultiplier || 0.7;
    this.dorsalColor = shapeOptions.dorsalColor || this.mainColor;

    //몸통 지느러미
    this.bodyFinWidthMultiplier = shapeOptions.bodyFinWidthMultiplier || 0.5;
    this.bodyFinHeightMultiplier = shapeOptions.bodyFinHeightMultiplier || 1.0;

    //꼬리 지느러미
    this.tailFinWidthMultiplier = shapeOptions.tailFinWidthMultiplier || 1.0;
    this.tailFinHeightMultiplier = shapeOptions.tailFinHeightMultiplier || 1.0;

    //크기
    this.bodySizeW = baseSize * BW;
    this.bodySizeH = this.bodySizeW * BH + BH_ADD;

    this.numBodySegments = 10;
    this.numTailSegments = 10;

    this.tailSizeW = this.bodySizeW * TW;
    this.tailSizeH = this.bodySizeH * TH;

    // 몸통 Flagellum
    this.body = new Flagellum(
      this.bodySizeW,
      this.bodySizeH,
      this.numBodySegments
    );

    // 꼬리 Flagellum
    this.tailR = new Flagellum(
      this.tailSizeW * this.tailFinWidthMultiplier,
      this.tailSizeH * this.tailFinHeightMultiplier,
      this.numTailSegments
    );

    this.tailL = new Flagellum(
      this.tailSizeW * 0.8 * this.tailFinWidthMultiplier,
      this.tailSizeH * 0.8 * this.tailFinHeightMultiplier,
      this.numTailSegments
    );

    // 몸통 지느러미
    this.numFinSegments = 9;
    this.finR = new Flagellum(
      this.tailSizeW * this.bodyFinWidthMultiplier,
      this.tailSizeH * this.bodyFinHeightMultiplier,
      this.numFinSegments
    );
    this.finL = new Flagellum(
      this.tailSizeW * this.bodyFinWidthMultiplier,
      this.tailSizeH * this.bodyFinHeightMultiplier,
      this.numFinSegments
    );
  }

  update(velocity) {
    const speed = velocity.mag();

    this.body.muscleFreq = map(speed, 0, 5, 0.0, 0.05);
    this.body.theta = velocity.heading();
    this.body.swim();

    let diffX =
      this.body.spine[this.numBodySegments - 1][0] -
      this.body.spine[this.numBodySegments - 2][0];
    let diffY =
      this.body.spine[this.numBodySegments - 1][1] -
      this.body.spine[this.numBodySegments - 2][1];
    let angle = atan2(diffY, diffX);

    this.tailR.muscleFreq = map(speed, 0, 5, 0.0, 0.08);
    this.tailR.theta = angle + PI * 0.95;
    this.tailR.swim();

    this.tailL.muscleFreq = map(speed, 0, 5, 0.0, 0.08);
    this.tailL.theta = angle + PI * 1.05;
    this.tailL.swim();

    this.finR.muscleFreq = map(speed, 0, 5, 0.0, 0.04);
    this.finR.swim();

    this.finL.muscleFreq = map(speed, 0, 5, 0.0, 0.04);
    this.finL.swim();
  }

  render(pos) {
    noStroke();

    this.mainColor.setAlpha(this.transparency);

    // 몸통 지느러미 위치
    let finBase = createVector(
      pos.x + this.body.spine[3][0],
      pos.y + this.body.spine[3][1]
    );

    fill(this.mainColor);
    this.renderFin(this.finR, finBase, this.bodySizeH * 0.5, 1);
    fill(this.mainColor);
    this.renderFin(this.finL, finBase, -this.bodySizeH * 0.5, -1);

    fill(this.mainColor);
    this.renderBody(this.body, pos, 1, 0.1);

    // 샥스핀
    if (this.hasDorsalFin) {
      this.renderDorsalFin(pos);
    }

    // 꼬리 위치
    let tailLocation = createVector(
      pos.x + this.body.spine[this.numBodySegments - 1][0],
      pos.y + this.body.spine[this.numBodySegments - 1][1]
    );

    fill(this.mainColor);
    this.renderTail(this.tailR, tailLocation, 0.75);
    fill(this.mainColor);
    this.renderTail(this.tailL, tailLocation, 0.75);

    // 눈
    let headLocation = createVector(
      pos.x + this.body.spine[1][0],
      pos.y + this.body.spine[1][1]
    );

    this.renderHead(headLocation, this.bodySizeW * 0.1, this.bodySizeW * 0.06);
  }

  makePointFromFlagellum(_flag, n, thickness, colour) {
    const x = _flag.spine[n][0];
    const y = _flag.spine[n][1];

    let dx, dy;

    if (n === 0) {
      dx = _flag.spine[1][0] - _flag.spine[0][0];
      dy = _flag.spine[1][1] - _flag.spine[0][1];
    } else {
      dx = _flag.spine[n][0] - _flag.spine[n - 1][0];
      dy = _flag.spine[n][1] - _flag.spine[n - 1][1];
    }

    const heading = atan2(dy, dx);

    const opt = {
      r: thickness * 0.5,
      colour: colour,
      distConstraint: _flag.spaceX,
    };

    const p = new Point(x, y, thickness, opt);
    p.setHeading(heading);
    return p;
  }

  renderHead(_location, _eyeSize, _eyeDist) {
    let diffX = this.body.spine[2][0] - this.body.spine[1][0];
    let diffY = this.body.spine[2][1] - this.body.spine[1][1];
    let angle = atan2(diffY, diffX);

    const finalEyeSize = _eyeSize * this.eyeSizeMultiplier;

    push();
    translate(_location.x, _location.y);
    rotate(angle);
    fill(0);
    ellipse(-3, _eyeDist, finalEyeSize, finalEyeSize);
    pop();

    push();
    translate(_location.x, _location.y);
    rotate(angle);
    fill(0);
    ellipse(-3, -_eyeDist, finalEyeSize, finalEyeSize);
    pop();
  }

  renderBody(_flag, _location, _sizeOffsetA, _sizeOffsetB) {
    push();
    translate(_location.x, _location.y);
    noStroke();
    beginShape(TRIANGLE_STRIP);

    for (let n = 0; n < _flag.numNodes; n++) {
      let t = n / (_flag.numNodes - 1);

      let b = bezierPoint(
        3,
        this.bodySizeH * _sizeOffsetA,
        this.bodySizeH * _sizeOffsetB,
        2,
        t
      );

      const thickness = max(1, b * 2);
      const pt = this.makePointFromFlagellum(
        _flag,
        n,
        thickness,
        this.mainColor
      );

      const cw = pt.getPointOnThickness(radians(90));
      const ccw = pt.getPointOnThickness(radians(-90));

      vertex(cw.x, cw.y);
      vertex(ccw.x, ccw.y);
    }

    endShape();
    pop();
  }

  renderTail(_flag, _location, _sizeOffset) {
    push();
    translate(_location.x, _location.y);
    noStroke();
    beginShape(TRIANGLE_STRIP);

    for (let n = 0; n < _flag.numNodes; n++) {
      let t = n / (_flag.numNodes - 1);

      let b = bezierPoint(2, _flag.sizeH, _flag.sizeH * _sizeOffset, 0, t);

      const thickness = max(1, b * 2);
      const pt = this.makePointFromFlagellum(
        _flag,
        n,
        thickness,
        this.mainColor
      );

      const cw = pt.getPointOnThickness(radians(90));
      const ccw = pt.getPointOnThickness(radians(-90));

      vertex(cw.x, cw.y);
      vertex(ccw.x, ccw.y);
    }

    endShape();
    pop();
  }

  renderFin(_flag, _location, _posOffset, _flip) {
    let diffX = this.body.spine[2][0] - this.body.spine[1][0];
    let diffY = this.body.spine[2][1] - this.body.spine[1][1];
    let angle = atan2(diffY, diffX);

    push();
    translate(_location.x, _location.y);
    rotate(angle);
    translate(0, _posOffset);

    noStroke();
    beginShape(TRIANGLE_STRIP);

    for (let n = 0; n < _flag.numNodes; n++) {
      let t = n / (_flag.numNodes - 1);

      let base = bezierPoint(0, _flag.sizeH * 0.75, _flag.sizeH * 0.75, 0, t);

      const thickness = max(1, base * 2);
      const pt = this.makePointFromFlagellum(
        _flag,
        n,
        thickness,
        this.mainColor
      );

      const cw = pt.getPointOnThickness(radians(90) * _flip);
      const ccw = pt.getPointOnThickness(radians(-90) * _flip);

      vertex(cw.x, cw.y);
      vertex(ccw.x, ccw.y);
    }

    endShape();
    pop();
  }

  // 샥스핀
  renderDorsalFin(_location) {
    const midIndex = floor(this.numBodySegments * 0.45);

    const x1 = this.body.spine[midIndex][0];
    const y1 = this.body.spine[midIndex][1];
    const x2 = this.body.spine[midIndex + 1][0];
    const y2 = this.body.spine[midIndex + 1][1];

    const angle = atan2(y2 - y1, x2 - x1);

    const baseW = this.bodySizeW * 0.25 * this.dorsalWidthMultiplier;
    const height = this.bodySizeH * 1.2 * this.dorsalHeightMultiplier;

    push();
    translate(_location.x + x1, _location.y + y1);
    rotate(angle);
    noStroke();
    fill(this.dorsalColor);

    beginShape();
    vertex(-baseW * 0.5, 0);
    vertex(baseW * 0.5, 0);
    vertex(0, -height);
    endShape(CLOSE);

    pop();
  }
}
