let shapes = [];
let bubbles = []; // 儲存水泡的陣列
let song;
let amplitude;

// 自定義多邊形基礎座標
let points = [
  [-3, 5], [3, 7], [1, 5], [2, 4], [4, 3], [5, 2], [6, 2], [8, 4], 
  [8, -1], [6, 0], [0, -3], [2, -6], [-2, -3], [-4, -2], [-5, -1], [-6, 1], [-6, 2]
];

function preload() {
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();
  song.loop();

  // 初始化 10 個多邊形
  for (let i = 0; i < 10; i++) {
    let randomMultiplier = random(10, 30);
    shapes.push({
      x: random(windowWidth),
      y: random(windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      color: color(random(255), random(255), random(255)),
      points: points.map(p => ({ px: p[0] * randomMultiplier, py: p[1] * randomMultiplier }))
    });
  }
}

function draw() {
  background('#ffcdb2');
  
  // --- 1. 處理水泡邏輯 ---
  // 機率性產生新水泡
  if (random(1) < 0.05) {
    bubbles.push({
      x: random(width),
      y: height + 20,
      speed: random(1, 3),
      size: random(10, 25),
      burstY: random(height * 0.1, height * 0.5), // 水泡預定破掉的高度
      isBursting: false,
      burstFrame: 0
    });
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    
    if (!b.isBursting) {
      // 水泡往上飄
      b.y -= b.speed;
      b.x += sin(frameCount * 0.05) * 0.5; // 輕微左右晃動
      
      // 繪製水泡（白色偏透明）
      noFill();
      stroke(255, 150); 
      strokeWeight(1.5);
      circle(b.x, b.y, b.size);
      // 水泡反光點
      fill(255, 100);
      noStroke();
      circle(b.x - b.size*0.2, b.y - b.size*0.2, b.size*0.2);

      // 檢查是否到達破掉位置或超出螢幕
      if (b.y < b.burstY) {
        b.isBursting = true;
      }
    } else {
      // 破掉動畫：圓圈變大且變透明
      b.burstFrame += 2;
      noFill();
      stroke(255, 255 - b.burstFrame * 5);
      strokeWeight(1);
      circle(b.x, b.y, b.size + b.burstFrame);
      
      // 動態結束後移除
      if (b.burstFrame > 50) {
        bubbles.splice(i, 1);
      }
    }
  }

  // --- 2. 處理多邊形邏輯 ---
  let level = amplitude.getLevel();
  let sizeFactor = map(level, 0, 1, 0.5, 2.0);
  strokeWeight(2);

  for (let shape of shapes) {
    shape.x += shape.dx;
    shape.y += shape.dy;

    if (shape.x < 0 || shape.x > windowWidth) shape.dx *= -1;
    if (shape.y < 0 || shape.y > windowHeight) shape.dy *= -1;

    fill(shape.color);
    stroke(shape.color);

    push();
    translate(shape.x, shape.y);
    scale(sizeFactor); 
    
    // 往右移時左右翻轉(flipX = -1)，且維持上下翻轉(scale Y = -1)
    let flipX = (shape.dx > 0) ? -1 : 1;
    scale(flipX, -1); 

    beginShape();
    for (let p of shape.points) {
      vertex(p.px, p.py);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}