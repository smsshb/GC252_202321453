// ===== Fish.js =====

class Fish {
  constructor(origin) {
    this.spine = new Chain(origin, 12, 64, PI / 8);
    this.bodyWidth = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];

    this.bodyColor = color(58, 124, 165);
    this.finColor = color(129, 195, 215);
  }

  resolve(fishes) {
  const head = this.spine.joints[0];

  // 시간(노이즈용)
  if (!this.t) this.t = random(1000);
  this.t += 0.01;

  // 1) 노이즈 기반 자연 각도 생성
  const noiseAngle = noise(this.t) * TWO_PI * 2 - TWO_PI;

  // 기존 각도 없으면 초기화
  if (!this.angle) this.angle = noiseAngle;

  // 각도 부드럽게 변화
  this.angle = lerpAngle(this.angle, noiseAngle, 0.03);

  let dir = p5.Vector.fromAngle(this.angle);

  // 2) 무리 중심 계산
  let center = createVector(0, 0);
  for (let f of fishes) center.add(f.spine.joints[0]);
  center.div(fishes.length);

  // 중심에서 너무 멀어지면 돌아옴
  let distToCenter = p5.Vector.dist(head, center);
  let maxDist = 600; 

  if (distToCenter > maxDist) {
    let toCenter = p5.Vector.sub(center, head).heading();
    this.angle = lerpAngle(this.angle, toCenter, 0.05);
  }

  // 3) 가까운 물고기 회피
  for (let f of fishes) {
    if (f === this) continue;
    let d = p5.Vector.dist(head, f.spine.joints[0]);

    if (d < 120) {
      let avoid = p5.Vector.sub(head, f.spine.joints[0]).heading();
      this.angle = lerpAngle(this.angle, avoid, 0.05);
    }
  }

  // 4) 속도 설정
  dir = p5.Vector.fromAngle(this.angle).setMag(3);
  let nextHead = p5.Vector.add(head, dir);

  // 5) 화면 밖으로 나가기 전에 자연스럽게 방향 틀기
  const margin = 200;
  if (nextHead.x < -margin || nextHead.x > width/0.5 + margin ||
      nextHead.y < -margin || nextHead.y > height/0.5 + margin) {

    const centerDir = p5.Vector.sub(center, head).heading();
    this.angle = lerpAngle(this.angle, centerDir, 0.05);
    nextHead = p5.Vector.add(head, p5.Vector.fromAngle(this.angle).setMag(3));
  }

  // 6) spine 업데이트
  this.spine.resolve(nextHead);
}



  display() {
    push();
    translate(width / 4, height / 4);
    scale(0.2);
    strokeWeight(4);
    stroke(255);
    fill(this.finColor);

    const j = this.spine.joints;
    const a = this.spine.angles;

    const headToMid1 = relativeAngleDiff(a[0], a[6]);
    const headToMid2 = relativeAngleDiff(a[0], a[7]);
    const headToTail = headToMid1 + relativeAngleDiff(a[6], a[11]);

    // === PECTORAL FINS ===
    push();
    translate(this.getPosX(3, PI / 3, 0), this.getPosY(3, PI / 3, 0));
    rotate(a[2] - PI / 4);
    ellipse(0, 0, 160, 64);
    pop();

    push();
    translate(this.getPosX(3, -PI / 3, 0), this.getPosY(3, -PI / 3, 0));
    rotate(a[2] + PI / 4);
    ellipse(0, 0, 160, 64);
    pop();

    // === VENTRAL FINS ===
    push();
    translate(this.getPosX(7, PI / 2, 0), this.getPosY(7, PI / 2, 0));
    rotate(a[6] - PI / 4);
    ellipse(0, 0, 96, 32);
    pop();

    push();
    translate(this.getPosX(7, -PI / 2, 0), this.getPosY(7, -PI / 2, 0));
    rotate(a[6] + PI / 4);
    ellipse(0, 0, 96, 32);
    pop();

    // === CAUDAL FINS ===
    beginShape();
    for (let i = 8; i < 12; i++) {
      const tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
      curveVertex(
        j[i].x + cos(a[i] - PI / 2) * tailWidth,
        j[i].y + sin(a[i] - PI / 2) * tailWidth
      );
    }
    for (let i = 11; i >= 8; i--) {
      const tailWidth = max(-13, min(13, headToTail * 6));
      curveVertex(
        j[i].x + cos(a[i] + PI / 2) * tailWidth,
        j[i].y + sin(a[i] + PI / 2) * tailWidth
      );
    }
    endShape(CLOSE);

    fill(this.bodyColor);

    // === BODY ===
    beginShape();
    for (let i = 0; i < 10; i++) {
      curveVertex(this.getPosX(i, PI / 2, 0), this.getPosY(i, PI / 2, 0));
    }

    curveVertex(this.getPosX(9, PI, 0), this.getPosY(9, PI, 0));

    for (let i = 9; i >= 0; i--) {
      curveVertex(this.getPosX(i, -PI / 2, 0), this.getPosY(i, -PI / 2, 0));
    }

    curveVertex(this.getPosX(0, -PI / 6, 0), this.getPosY(0, -PI / 6, 0));
    curveVertex(this.getPosX(0, 0, 4), this.getPosY(0, 0, 4));
    curveVertex(this.getPosX(0, PI / 6, 0), this.getPosY(0, PI / 6, 0));

    curveVertex(this.getPosX(0, PI / 2, 0), this.getPosY(0, PI / 2, 0));
    curveVertex(this.getPosX(1, PI / 2, 0), this.getPosY(1, PI / 2, 0));
    curveVertex(this.getPosX(2, PI / 2, 0), this.getPosY(2, PI / 2, 0));
    endShape(CLOSE);

    fill(this.finColor);

    // === DORSAL FIN ===
    beginShape();
    vertex(j[4].x, j[4].y);
    bezierVertex(j[5].x, j[5].y, j[6].x, j[6].y, j[7].x, j[7].y);
    bezierVertex(
      j[6].x + cos(a[6] + PI / 2) * headToMid2 * 16,
      j[6].y + sin(a[6] + PI / 2) * headToMid2 * 16,
      j[5].x + cos(a[5] + PI / 2) * headToMid1 * 16,
      j[5].y + sin(a[5] + PI / 2) * headToMid1 * 16,
      j[4].x,
      j[4].y
    );
    endShape();

    // === EYES ===
    fill(255);
    ellipse(this.getPosX(0, PI / 2, -18), this.getPosY(0, PI / 2, -18), 24, 24);
    ellipse(
      this.getPosX(0, -PI / 2, -18),
      this.getPosY(0, -PI / 2, -18),
      24,
      24
    );
    pop();
  }

  getPosX(i, angleOffset, lengthOffset) {
    return (
      this.spine.joints[i].x +
      cos(this.spine.angles[i] + angleOffset) *
        (this.bodyWidth[i] + lengthOffset)
    );
  }

  getPosY(i, angleOffset, lengthOffset) {
    return (
      this.spine.joints[i].y +
      sin(this.spine.angles[i] + angleOffset) *
        (this.bodyWidth[i] + lengthOffset)
    );
  }
}
