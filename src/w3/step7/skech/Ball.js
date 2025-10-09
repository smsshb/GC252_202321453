class Ball {
  posX = 0;
  posY = 0;
  diameter = 100;
  speed = 5;
  velX = 1;
  velY = 1;
  colour = 0;
  constructor(x, y, diameter, speed, colour) {
    this.posX = x;
    this.posY = y;
    this.diameter = diameter;
    this.speed = speed;
    this.colour = colour;
    this.resetVelocity();
  }

  update() {
    this.posX += this.velX;
    this.posY += this.velY;
  }

  resolveWallCollision() {
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
    // 만약 마우스가 원 위에 있다면 색 채워진 원
    if (this.isHovered()) {
      fill(this.colour);
      noStroke();
      // 만약 마우스가 원 위에 있지 않다면 라인만 있는 원
    } else {
      stroke(this.colour);
      noFill();
    }
    circle(this.posX, this.posY, this.diameter);
  }

  reset(x, y) {
    this.posX = x;
    this.posY = y;
    this.resetVelocity();
  }

  resetVelocity() {
    let randomAngle = random(360);
    this.velX = this.speed * cos(radians(randomAngle));
    this.velY = this.speed * sin(radians(randomAngle));
  }

  isHovered() {
    // 아래의 두 줄은 마우스와 원 사이의 x, y 거리 값
    let dx = this.posX - mouseX;
    let dy = this.posY - mouseY;
    // 아래의 두 줄은 피타고라스를 이용해 마우스와 원 사이의 직선거리 값을 계산하는 과정
    // let dist = sqrt(dx * dx + dy * dy);
    let dist = (dx ** 2 + dy ** 2) ** (1 / 2);
    // 아래는 도출된 dist(위의 연산을 통해 구한 거리)값이 원의 반지름보다 작은지 아닌지 판별 > 만약 작다면 반지름보다 원과 마우스사이의 거리가 좁은것이니 원 위에 마우스가 올라간 상황임
    return dist < 0.5 * this.diameter;
  }
}
