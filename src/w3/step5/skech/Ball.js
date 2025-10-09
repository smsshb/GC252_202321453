class Ball {
  posX = 0;
  posY = 0;
  diameter = 100;
  speed = 5;
  velX = 1;
  velY = 1;
  colour = 0;
  constructor(x, y, diameter, speed, colour) {
    //step4에서 let 어쩌구의 선언+초기화 역할
    this.posX = x;
    this.posY = y;
    this.diameter = diameter;
    this.speed = speed;
    this.colour = colour;
    this.resetVelocity();
  }

  update() {
    //step4에서 공의 위치변화를 만드는 부분 역할
    this.posX += this.velX;
    this.posY += this.velY;
  }

  resolveWallCollision() {
    //step4에서 벽 충돌을 만드는 if부분 역할
    if (this.posX > width - 0.5 * this.diameter) {
      this.velX *= -1;
    } else if (this.posX < 0.5 * this.diameter) {
      this.velX *= -1;
    }
    if (this.posY > height - 0.5 * this.diameter) {
      this.velY *= -1;
    } else if (this.posY < 0.5 * this.diameter) {
      this.velY *= -1;
    }
  }

  show() {
    //step4에서 draw함수의 역할
    fill(this.colour);
    noStroke();
    circle(this.posX, this.posY, this.diameter);
  }

  reset(x, y) {
    this.posX = x;
    this.posY = y;
    this.resetVelocity();
  }

  resetVelocity() {
    //step4에서 mousePressed부분 역할
    let randomAngle = random(360);
    this.velX = this.speed * cos(radians(randomAngle));
    this.velY = this.speed * sin(radians(randomAngle));
  }
}
