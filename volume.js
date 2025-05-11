var volume=50;
var theta = 0;
var g = 0.1;
var mu = 0.1;
var v = 0;
const Y_AXIS = 1;
const X_AXIS = 2;
function setup() {
  createCanvas(400,400);
}
var pointer = .5;
var vp = .01;
var hw = 0.1;
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}
function keyPressed() {
  if (key == ' ') {
    let v = abs(pointer-0.5)*2;
    if (abs(v-0.5)<hw) {
      volume += 5;
    } else {
      volume = 0;
    }
  }
}
function draw2() {
  stroke(0);
  fill(255);
  rect(100,100,30,200);
  fill(0);
  rect(100,300-2*volume, 30, 2*volume);
  fill(255,0,0)
  rect(65,320,100,15);
  setGradient(115-hw*150,321,150*hw,13,color(255,0,0),color(0,255,0),X_AXIS);
  setGradient(115,321,150*hw,13,color(0,255,0),color(255,0,0),X_AXIS);
  push();
  translate(65+abs(pointer-0.5)*200,335);
  stroke(0);
  beginShape();
  vertex(0,0);
  vertex(-4,10);
  vertex(4,10);
  endShape(CLOSE);
  pop();

  pointer += vp;
  pointer -= floor(pointer);
}
function mouseReleased() {
  theta = 0;
}
function mouseDragged() {
  var v = createVector(mouseX-250, mouseY-50);
  var pv = createVector(pmouseX-250,pmouseY-50);
  theta -= v.angleBetween(pv);
}
function draw() {
  background(255);
  
  draw2();
  noStroke();
  fill(0);
  textSize(15);
  text("Volume: "+round(volume), 30,58);
  push();
  translate(250, 50);
  rotate(theta);
  stroke(0);
  fill(200);
  rect(-100,-15,200,30);
  stroke(100);
  strokeWeight(4);
  line(-60,0,60,0);
  noStroke();
  fill(255);
  ellipseMode(CENTER);
  ellipse(1.2*volume-60, 0, 13);
  ellipse(90,0,10);
  pop();
  let a1=g*sin(theta);
  let a2 = mu*g*cos(theta);
  if (v > 0 || a1 > a2) {
    a1 -= a2;
  } else if (v < 0 || -a1 > a2) {
    a1 += a2;
  } else {
    a1 = 0;
  }
  v += a1;
  volume = constrain(volume+v,0,100);
}