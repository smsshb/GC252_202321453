/*
- 창 크기에 맞게 전체 화면 캔버스 (createCanvas(windowWidth, windowHeight))
- 창 크기 변경 시 windowResized()에서 다시 계산
- sort() 제거한 최적화 버전
- animSpeed로 일렁이는 속도 조절 가능
*/

const frmLen = 30; // 파형 프레임 개수 (줄이면 계산 시간 감소)
const animSpeed = 0.5; // 1보다 작으면 느리게, 크면 빠르게

let initPoints = [];
let points = [];
let wave = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // 화면 크기 기준
  pixelDensity(1);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(12);

  generateWaveData(); // 처음 한 번 계산
}

// 창 크기 바뀔 때마다 호출됨
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  generateWaveData(); // 새 캔버스 크기에 맞게 다시 계산
}

// 파형 데이터 전체를 다시 만드는 함수
function generateWaveData() {
  console.log("Re-generating wave data...");

  initPoints = [];
  points = [];
  wave = [];

  randomSeed(70);

  // 초기 포인트 생성
  for (let i = 0; i < 100; i++) {
    initPoints.push(createVector(random(width), random(height)));
  }

  // 각 프레임별 포인트 위치 계산
  for (let f = 0; f < frmLen; f++) {
    points.push([]);
    for (let i = 0; i < initPoints.length; i++) {
      let pX =
        50 * sin((f * 360) / frmLen + 6 * initPoints[i].x) + initPoints[i].x;
      let pY =
        50 * cos((f * 360) / frmLen + 6 * initPoints[i].y) + initPoints[i].y;
      points[f].push(createVector(pX, pY));
    }
  }

  // 각 프레임의 픽셀 데이터 미리 생성
  for (let f = 0; f < frmLen; f++) {
    wave[f] = new Uint8ClampedArray(width * height * 4); // RGBA

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let minDist = Infinity;

        // 가장 가까운 포인트까지의 거리^2만 추적 (sort 없음!)
        for (let i = 0; i < points[f].length; i++) {
          let dx = x - points[f][i].x;
          let dy = y - points[f][i].y;
          let d = dx * dx + dy * dy;
          if (d < minDist) minDist = d;
        }

        let noise = Math.sqrt(minDist);
        let index = (x + y * width) * 4;

        // Nighttime 색상
        wave[f][index + 0] = waveColor(noise, 40, 32, 2.2);
        wave[f][index + 1] = waveColor(noise, 30, 55, 3.34);
        wave[f][index + 2] = waveColor(noise, 30, 68, 3.55);
        wave[f][index + 3] = 255; // alpha
      }
    }

    console.log("Generating frame data: " + (f + 1) + "/" + frmLen);
  }

  console.log("Wave data generated for size:", width, height);
}

function draw() {
  // 아직 wave 데이터가 없으면 그리기 스킵
  if (!wave.length) return;

  let frameIndex = floor(frameCount * animSpeed) % frmLen;

  loadPixels();
  pixels.set(wave[frameIndex]); // 한 번에 복사
  updatePixels();
}

// 파도 색상 계산 함수
function waveColor(x, a, b, e) {
  if (x < 0) return b;
  else return Math.pow(x / a, e) + b;
}
