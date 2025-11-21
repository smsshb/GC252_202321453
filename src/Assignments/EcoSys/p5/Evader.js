class Evader {
  constructor(x, y, options = {}) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.r = options.r || random(14, 22);

    this.maxSpeed = options.maxSpeed || 10;
    this.maxForce = options.maxForce || 0.05;
    this.visionRadius = options.visionRadius || 300;
    this.mossSenseRadius = options.mossSenseRadius || 150;

    this.colour = options.colour || "#1f376bff";

    // 몸통 쉐입
    this.shape = new Fish(this.r, this.colour, {
      bodyWidthMultiplier: 4.8, // 몸 길이
      bodyHeightMultiplier: 0.22, // 몸 두께
      bodyHeightOffset: 3, // 두께
      tailWidthMultiplier: 0.55, // 꼬리 폭
      tailHeightMultiplier: 0.2, // 꼬리 높이
      eyeSizeMultiplier: 0.5, //눈
    });
  }

  // 가까운 상어 찾기
  findClosestPursuer(pursuers) {
    let closest = null;
    let minDist = Infinity;
    for (const p of pursuers) {
      const d = this.pos.dist(p.pos);
      if (d < minDist && d < this.visionRadius) {
        minDist = d;
        closest = p;
      }
    }
    return closest;
  }

  // 상어가 일정 거리 안에 있는지 체크
  isInDanger(pursuers, dangerRadius = this.visionRadius * 0.7) {
    for (const p of pursuers) {
      const d = this.pos.dist(p.pos);
      if (d < dangerRadius) return true;
    }
    return false;
  }

  // 중간 물고기끼리 너무 가까우면 떨어지기 (개선 버전)
  separate(others) {
    const desiredSeparation = this.r * 3; // 이 값 키우면 더 멀리 떨어짐
    let steer = createVector(0, 0);
    let count = 0;

    for (const o of others) {
      if (o === this) continue;

      const d = this.pos.dist(o.pos);

      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, o.pos); // 나 - 상대
        diff.normalize();
        diff.div(d); // 가까울수록 더 강하게 밀어냄
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
      steer.limit(this.maxForce * 2); // 분리 힘 조금 더 강하게
      this.applyForce(steer);
    }
  }

  // 중간 물고기끼리 어느 정도 뭉치기
  cohesion(others) {
    const neighbordist = this.r * 6;
    const centre = createVector(0, 0);
    let count = 0;

    for (const o of others) {
      const d = this.pos.dist(o.pos);
      if (o !== this && d > 0 && d < neighbordist) {
        centre.add(o.pos);
        count++;
      }
    }
    if (count > 0) {
      centre.div(count);
      this.seek(centre);
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  flee(target) {
    const desired = p5.Vector.sub(this.pos, target);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    // ⚠ 상어 도망치는 힘은 좀 더 강하게
    steering.limit(this.maxForce * 2);
    this.applyForce(steering);
  }

  // 상어 예측 회피
  evade(pursuers, prediction = 30) {
    const closest = this.findClosestPursuer(pursuers);
    if (!closest) return;
    const predictedVel = p5.Vector.mult(closest.vel, prediction);
    const futurePos = p5.Vector.add(closest.pos, predictedVel);
    this.flee(futurePos);
  }

  // 이끼 먹기 + 가까운 이끼 향해 움직이기
  // 🔧 pursuers 추가됨
  eatMoss(mosses, pursuers) {
    let closest = null;
    let minDist = Infinity;

    for (const m of mosses) {
      const d = this.pos.dist(m.pos);
      if (d < minDist) {
        minDist = d;
        closest = m;
      }
    }

    const inDanger = this.isInDanger(pursuers);

    // ⚠ 위험하지 않을 때만 이끼 쪽으로 이동
    if (!inDanger && closest && minDist < this.mossSenseRadius) {
      this.seek(closest.pos);
    }

    // 실제로 먹는 판정
    for (let i = mosses.length - 1; i >= 0; i--) {
      const m = mosses[i];
      const d = this.pos.dist(m.pos);
      if (d < this.r + m.r) {
        mosses.splice(i, 1);
        mosses.push(new Moss(random(width), random(height)));
      }
    }
  }

  wander() {
    const theta = random(TWO_PI);
    const force = p5.Vector.fromAngle(theta);
    force.setMag(0.01);
    this.applyForce(force);
  }

  wrapCoordinates() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    this.shape.update(this.vel);
    this.shape.render(this.pos);
  }
}
