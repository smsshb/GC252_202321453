const { Engine, World, Bodies, Body, Vector } = Matter;

let engine;
let world;
let bounds = [];
let balls = [];

let clockSecond, clockMinute, clockHour;

const BALL_NUM = 500;
const ATTRACT_CLOSE = 0.0000005;
const ATTRACT_FAR = 0.005;
const MAX_SPEED = 50000;
const BALL_PADDING = 3;

function initMatter() {
  engine = Engine.create();
  world = engine.world;
  world.gravity.x = 0;
  world.gravity.y = 0;

  buildWalls();
  createBalls();
}

function createBalls() {
  balls = [];

  for (let i = 0; i < BALL_NUM; i++) {
    const drawR = random(5, 20);
    const collR = drawR + BALL_PADDING;

    const body = Bodies.circle(random(width), random(height), collR, {
      friction: 0.05,
      frictionAir: 0.08,
      restitution: 0.2,
      density: 0.001,
    });

    balls.push({ body, drawR });
    World.add(world, body);
  }
}

function createClocks(secondslength, minuteslength, hourslength) {
  clockSecond = createclockBody(secondslength, 15);
  clockMinute = createclockBody(minuteslength, 20);
  clockHour = createclockBody(hourslength, 30);

  World.add(world, [clockSecond, clockMinute, clockHour]);
}

function stepMatter() {
  Engine.update(engine, 1000 / 60);
}

function createAttractMouse(mx, my) {
  const target = Vector.create(mx, my);

  for (const o of balls) {
    const pos = o.body.position;
    const dir = Vector.sub(target, pos);
    const dist = Vector.magnitude(dir);

    if (dist > 0.0001) {
      const dirN = Vector.mult(dir, 1 / dist);
      const k = dist > 300 ? ATTRACT_FAR : ATTRACT_CLOSE;
      const force = Vector.mult(dirN, k * o.body.mass);
      Body.applyForce(o.body, pos, force);
    }
  }
}

function explodeBall(mx, my) {
  const center = Vector.create(mx, my);

  const EXPLODE_FORCE = 0.3;
  const MIN_DIST = 50;
  const FALL_OFF = 500;

  for (const o of balls) {
    const pos = o.body.position;

    const dir = Vector.sub(pos, center);
    let dist = Vector.magnitude(dir);

    if (dist < 0.0001) dist = 0.0001;
    if (dist < MIN_DIST) dist = MIN_DIST;

    const dirN = Vector.mult(dir, 1 / dist);

    const strength = EXPLODE_FORCE * (FALL_OFF / (FALL_OFF + dist));

    const force = Vector.mult(dirN, strength * o.body.mass);
    Body.applyForce(o.body, pos, force);
  }
}

function createclockBody(length, thickness) {
  return Bodies.rectangle(0, 0, thickness, length, {
    isStatic: true,
  });
}

function updateclock(clock, length, angleRad, mx, my) {
  const offset = Vector.rotate(Vector.create(0, -length / 2), angleRad);
  Body.setPosition(clock, { x: mx + offset.x, y: my + offset.y });
  Body.setAngle(clock, angleRad);
}

//화면 밖으로 안나가도록
function buildWalls() {
  if (world && bounds.length) {
    World.remove(world, bounds);
  }

  const t = 1000;
  const opt = { isStatic: true };

  bounds = [
    Bodies.rectangle(width / 2, -t / 2, width + t * 2, t, opt),
    Bodies.rectangle(width / 2, height + t / 2, width + t * 2, t, opt),
    Bodies.rectangle(-t / 2, height / 2, t, height + t * 2, opt),
    Bodies.rectangle(width + t / 2, height / 2, t, height + t * 2, opt),
  ];

  World.add(world, bounds);
}
