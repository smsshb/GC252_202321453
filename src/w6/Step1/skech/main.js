const points = [];
const pointsNum = 10;
let mouse;

function setup() {
  createCanvas(600, 800);

  colorMode(HSB, 360, 100, 100);
  for (let n = 0; n < pointsNum; n++) {
    const x = width / 2;
    const y = height / 4 + 50 * n;
    const hue = map(n, 0, pointsNum - 1, 0, 240);
    const colour = color(hue, 100, 100);
    const options = {
      colour: colour,
      distConstraint: 50,
    };
    const newPoint = new Point(x, y, options);
    points.push(newPoint);
  }

  mouse = createVector(width / 2, height / 4);
}

function draw() {
  background(0);

  if (mouseIsPressed) {
    mouse.set(mouseX, mouseY);
  }

  points[0].setPos(mouse);

  points.forEach((aPoint, idx) => {
    if (idx > 0) {
      aPoint.constrainedBy(points[idx - 1], true);
    }
  });
  points[0].setHeading(points[1].heading);

  points.forEach((aPoint) => {
    aPoint.show();
    aPoint.showDistConstraint();
  });
}
