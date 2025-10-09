// Array 변수 선언
let balls = [];

function setup() {
  createCanvas(600, 400);
  // 2줄에서 선언한 balls변수에 4개의 서로다른 값을 넣음
  balls.push(new Ball(0.5 * width, 0.5 * height, 100, 7, "red"));
  balls.push(new Ball(0.5 * width, 0.5 * height, 50, 10, "blue"));
  balls.push(new Ball(0.5 * width, 0.5 * height, 200, 3, "yellow"));
  balls.push(new Ball(0.5 * width, 0.5 * height, 150, 2, "pink"));
}

function draw() {
  background(127);
  // balls배열 안에 들어있는 값이 0번째부터 차례로 함수에 적용됨
  // for(let idx = 0; idx < balls.length; idx++) {
  //   balls[idx].update();
  //   balls[idx].resolveWallCollision();
  //   balls[idx].show();
  // }

  // for...of구문 - 배열 안의 요소를 하나씩 꺼내서 반복
  // for (let aBall of balls) {
  //   aBall.update();
  //   aBall.resolveWallCollision();
  //   aBall.show();
  // }

  // forEach구문 - 배열 안의 모든 요소를 한 번씩 꺼내서, 지정한 작업을 수행
  balls.forEach((aBall) => {
    aBall.update();
    aBall.resolveWallCollision();
    aBall.show();
  });

  fill("black");
  noStroke();
  circle(mouseX, mouseY, 50);
}

function mousePressed() {
  balls.forEach((aBall) => {
    aBall.reset(0.5 * width, 0.5 * height);
  });
}
