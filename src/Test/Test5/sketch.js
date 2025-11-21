let mosses = [];
let mids = [];
let bigs = [];
let sardines = [];

function setup() {
  createCanvas(800, 600);

  // 이끼
  for (let i = 0; i < 25; i++) {
    let s = random(4, 8); // 가장 작음
    mosses.push(new Moss(random(width), random(height), s));
  }

  // 큰 물고기 1–3마리
  let numBig = int(random(1, 4));
  for (let i = 0; i < numBig; i++) {
    let s = random(24, 32);
    bigs.push(new BigFish(random(width), random(height), s));
  }

  // 중간 물고기 8–10마리
  let numMid = int(random(8, 11));
  for (let i = 0; i < numMid; i++) {
    let s = random(14, 20);
    mids.push(new MidFish(random(width), random(height), s));
  }

  // 정어리떼
  for (let i = 0; i < 40; i++) {
    let s = random(8, 12);
    sardines.push(new Sardine(random(width), random(height), s));
  }
}

function draw() {
  background(10, 30, 60); // 물색

  // 이끼 업데이트/표시
  for (let m of mosses) {
    m.update();
    m.show();
  }

  // 큰 물고기 행동/업데이트/표시
  for (let b of bigs) {
    b.behave(mids, bigs);
    b.update();
    b.show();
  }

  // 중간 물고기 행동/업데이트/표시
  for (let f of mids) {
    f.behave(mosses, bigs, mids);
    f.update();
    f.show();
  }

  // 정어리 행동
  for (let s of sardines) {
    s.behave(sardines, bigs);
    s.update();
    s.show();
  }

  // 포식 관계 처리 (중간이 이끼 먹기 / 큰 물고기가 중간 먹기)
  handleEating();
}

// ---------------- 공통 유틸 ----------------

function wrapAround(pos) {
  if (pos.x < 0) pos.x = width;
  if (pos.x > width) pos.x = 0;
  if (pos.y < 0) pos.y = height;
  if (pos.y > height) pos.y = 0;
}

// ---------------- 이끼 ----------------

class Moss {
  constructor(x, y, size) {
    this.base = createVector(x, y);
    this.pos = this.base.copy();
    this.size = size;
    this.offset = random(1000);
  }

  update() {
    // 물살에 살짝 흔들리는 느낌
    this.offset += 0.01;
    let angle = noise(this.offset) * TWO_PI * 2.0;
    let r = 2;
    this.pos.x = this.base.x + cos(angle) * r;
    this.pos.y = this.base.y + sin(angle) * r;
  }

  show() {
    noStroke();
    fill(40, 120, 60);
    ellipse(this.pos.x, this.pos.y, this.size, this.size * 1.3);
  }
}

// ---------------- 중간 물고기 ----------------

class MidFish {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.size = size;
    this.maxSpeed = 2.0;
    this.maxForce = 0.05;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  behave(mosses, bigs, mids) {
    let fleeForce = this.fleeBigFish(bigs);
    let foodForce = this.seekMoss(mosses);
    let cohesionForce = this.cohesion(mids);

    fleeForce.mult(2.0); // 포식자 회피 우선순위 ↑
    foodForce.mult(0.8); // 먹이 따라가긴 하지만 너무 과하진 않게
    cohesionForce.mult(0.7); // 살짝 뭉치도록

    this.applyForce(fleeForce);
    this.applyForce(foodForce);
    this.applyForce(cohesionForce);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d === 0) return createVector(0, 0);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  seekMoss(mosses) {
    let perception = 120;
    let closest = null;
    let record = Infinity;
    for (let m of mosses) {
      let d = p5.Vector.dist(this.pos, m.pos);
      if (d < perception && d < record) {
        record = d;
        closest = m.pos;
      }
    }
    if (closest) {
      return this.seek(closest);
    }
    return createVector(0, 0);
  }

  fleeBigFish(bigs) {
    let threatRadius = 140;
    let total = createVector(0, 0);
    let count = 0;
    for (let b of bigs) {
      let d = p5.Vector.dist(this.pos, b.pos);
      if (d < threatRadius) {
        let diff = p5.Vector.sub(this.pos, b.pos);
        diff.normalize();
        diff.div(d); // 가까우면 더 강하게
        total.add(diff);
        count++;
      }
    }
    if (count > 0) {
      total.setMag(this.maxSpeed);
      total.sub(this.vel);
      total.limit(this.maxForce * 1.5);
      return total;
    }
    return createVector(0, 0);
  }

  cohesion(mids) {
    let neighborDist = 90;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of mids) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d < neighborDist) {
        sum.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return createVector(0, 0);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    wrapAround(this.pos);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    noStroke();
    fill(230, 200, 80);
    // 약간 타원형 물고기
    ellipse(0, 0, this.size, this.size * 0.6);
    triangle(
      this.size * 0.3,
      0,
      this.size * 0.5,
      this.size * 0.2,
      this.size * 0.5,
      -this.size * 0.2
    );
    pop();
  }
}

// ---------------- 큰 물고기 ----------------

class BigFish {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.size = size;
    this.maxSpeed = 2.4;
    this.maxForce = 0.06;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  behave(mids, bigs) {
    let huntForce = this.huntMidFish(mids);
    let sepForce = this.separate(bigs);

    huntForce.mult(1.5);
    sepForce.mult(1.0);

    this.applyForce(huntForce);
    this.applyForce(sepForce);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d === 0) return createVector(0, 0);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  huntMidFish(mids) {
    let perception = 200;
    let closest = null;
    let record = Infinity;
    for (let m of mids) {
      let d = p5.Vector.dist(this.pos, m.pos);
      if (d < perception && d < record) {
        record = d;
        closest = m.pos;
      }
    }
    if (closest) {
      return this.seek(closest);
    }
    return createVector(0, 0);
  }

  separate(bigs) {
    let desiredSeparation = this.size * 1.5;
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of bigs) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
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
      steer.limit(this.maxForce * 1.5);
    }

    return steer;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    wrapAround(this.pos);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    noStroke();
    fill(220, 80, 60);
    // 조금 더 뾰족한 큰 물고기
    triangle(
      -this.size * 0.5,
      -this.size * 0.4,
      -this.size * 0.5,
      this.size * 0.4,
      this.size * 0.6,
      0
    );
    pop();
  }
}

// ---------------- 정어리 ----------------

class Sardine {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.size = size;
    this.maxSpeed = 2.2;
    this.maxForce = 0.07;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  behave(sardines, bigs) {
    let sep = this.separate(sardines);
    let ali = this.align(sardines);
    let coh = this.cohesion(sardines);
    let flee = this.fleeBigFish(bigs);

    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    flee.mult(2.0); // 큰 물고기는 적극적으로 피함

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(flee);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    wrapAround(this.pos);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    noStroke();
    fill(180, 210, 240);
    ellipse(0, 0, this.size, this.size * 0.4);
    pop();
  }

  separate(sardines) {
    let desiredSeparation = this.size * 1.5;
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of sardines) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
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
      steer.limit(this.maxForce * 1.5);
    }

    return steer;
  }

  align(sardines) {
    let neighborDist = 80;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of sardines) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d < neighborDist) {
        sum.add(other.vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    return createVector(0, 0);
  }

  cohesion(sardines) {
    let neighborDist = 90;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of sardines) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d < neighborDist) {
        sum.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return createVector(0, 0);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d === 0) return createVector(0, 0);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  fleeBigFish(bigs) {
    let threatRadius = 130;
    let total = createVector(0, 0);
    let count = 0;
    for (let b of bigs) {
      let d = p5.Vector.dist(this.pos, b.pos);
      if (d < threatRadius) {
        let diff = p5.Vector.sub(this.pos, b.pos);
        diff.normalize();
        diff.div(d);
        total.add(diff);
        count++;
      }
    }
    if (count > 0) {
      total.setMag(this.maxSpeed);
      total.sub(this.vel);
      total.limit(this.maxForce * 1.8);
      return total;
    }
    return createVector(0, 0);
  }
}

// ---------------- 먹이 관계 처리 ----------------

function handleEating() {
  // 중간 물고기가 이끼를 먹음
  for (let f of mids) {
    for (let i = mosses.length - 1; i >= 0; i--) {
      let m = mosses[i];
      let d = p5.Vector.dist(f.pos, m.pos);
      if (d < (f.size + m.size) * 0.4) {
        mosses.splice(i, 1);
      }
    }
  }

  // 큰 물고기가 중간 물고기를 먹음
  for (let b of bigs) {
    for (let i = mids.length - 1; i >= 0; i--) {
      let f = mids[i];
      let d = p5.Vector.dist(b.pos, f.pos);
      if (d < (b.size + f.size) * 0.4) {
        mids.splice(i, 1);
      }
    }
  }
}
