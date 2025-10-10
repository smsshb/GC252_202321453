const vehicles = [];
let target;

function setup() {
  createCanvas(800, 600);

  for (let n = 0; n < 20; n++) {
    const newVehicle = new Vehicle(random(width), random(height), 3, 0.1);
    vehicles.push(newVehicle);
  }

  target = createVector(width / 2, height / 2);
}

function draw() {
  if (mouseIsPressed) {
    if (keyIsDown(SHIFT)) {
      const newVehicle = new Vehicle(
        mouseX + random(-1, 1),
        mouseY + random(-1, 1),
        3,
        0.1
      );
      vehicles.push(newVehicle);
    } else {
      target.set(mouseX, mouseY);
    }
  }

  background(0);

  noStroke();
  fill("red");
  circle(target.x, target.y, 16);

  vehicles.forEach((aVehicle) => {
    aVehicle.seek(target, 1);
    aVehicle.separate(vehicles, 3);
  });

  vehicles.forEach((aVehicle) => {
    aVehicle.update();
    aVehicle.wrapCoordinates();
    aVehicle.show();
    // aVehicle.showVel();
  });
}
