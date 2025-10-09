class Emitter {
  balls = [];
  pos; //위치
  emitRate; //몇 개나 emit 할 지
  speedRange; //속도의 범위
  angleRange; //각도의 범위
  constructor(x, y, emitRate = 2, speedRange = [1, 5], angleRange = 30) {
    this.pos = createVector(x, y);
    this.emitRate = emitRate;
    this.speedRange = speedRange;
    this.angleRange = angleRange;
  }

  emit() {
    for (let n = 0; n < this.emitRate; n++) {
      let randomSpeed = random(this.speedRange[0], this.speedRange[1]);
      let randomAngle =
        -90 + random(-0.5 * this.angleRange, 0.5 * this.angleRange);
      let randomVel = createVector(
        randomSpeed * cos(radians(randomAngle)),
        randomSpeed * sin(radians(randomAngle))
      );
      this.balls.push(
        new Ball(
          this.pos.x,
          this.pos.y,
          10,
          pallete[floor(random(pallete.length))],
          randomVel
        )
      );
    }
  }

  loop(gravity) {
    this.balls.forEach((aBall) => {
      aBall.applyGravity(gravity);
      aBall.update();
    });
    for (let idx = this.balls.length - 1; idx >= 0; idx--) {
      if (!this.balls[idx].isInsideCanvas()) {
        this.balls.splice(idx, 1);
      }
    }
  }

  show() {
    this.balls.forEach((aBall) => {
      aBall.show();
    });
  }
}
