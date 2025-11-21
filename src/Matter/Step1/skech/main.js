const elem = document.querySelector("#matter-box");
console.log(elem);

// // module aliases
// const Engine = Matter.Engine,//물리 시뮬레이션
//   Render = Matter.Render,//화면상에 그래픽을 나타내는 것
//   Runner = Matter.Runner,//시간을 흐르게 해주는 것
//   Bodies = Matter.Bodies,//물'체'
//   Composite = Matter.Composite;//공간 =/=composites
const { Engine, Render, Runner, Bodies, Composite } = Matter;
//객체구조분해할당

// create an engine 필수사항
const engine = Engine.create();

// create a renderer
const render = Render.create({
  element: elem,
  engine: engine, //=engine
});

// create two boxes and a ground
const boxA = Bodies.rectangle(400, 200, 50, 50);
const boxB = Bodies.rectangle(450, 10, 80, 80);
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
