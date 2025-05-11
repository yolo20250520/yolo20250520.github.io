var theta=0;
var N=10;
var v=0;
var a=0;
var imgs=[];
var triggerBtn;
var cvs;
const STOP=0, START=1, STOPPING=2;
var status=STOP;
var selected = -1;
var goodText = ['烤棉花糖味','生日蛋糕味','椰子味','甘草味','桃子味','巧克力布丁味','梨子味','草莓香蕉冰沙味','什锦水果味','奶油爆米花味'];
var badText =  ['臭虫味','洗碗水味','酸牛奶味','臭鼬屁味','呕吐物味','狗粮味','鼻屎味','死鱼味','臭袜子味','臭鸡蛋味'];
function preload()
{
  for (var i=0; i<N; i++)
  {
    imgs.push(loadImage('b'+(i+1)+'.jpg'));
  }
}
function setup()
{
  var m = min(windowWidth,windowHeight);
  // var m = 1000;
  cvs = createCanvas(m, m);
  // createDiv(m*0.2);
  // createDiv(displayHeight);
  // createDiv(windowWidth);
  // createDiv(windowHeight);

  triggerBtn = createButton('开始');
  // triggerBtn.position(cvs.position().x+m*0.02,cvs.position().y+m*.02);
  var sze = m;
  triggerBtn.size(sze,sze*.618);
  triggerBtn.style('font-size',round(sze*.8/2)+'px');
  triggerBtn.mousePressed(trigger);
}
function trigger()
{
  if (status == STOP)
  {
    status = START;
    triggerBtn.html('停!');
    v = 0.2;
    selected = -1;
  } else if (status == START) {
    status = STOPPING;
    triggerBtn.html('开始');
    a = -random(0.0015,0.004);
    // v = 0;

  }
}
function draw()
{
  background(51);
  translate(width/2,height/2);
  drawDisk();
  drawPtr();
  theta += v;
  v+=a;
  if (status == STOPPING && v <= 0)
  {
    status = STOP;
    v = 0;
    a = 0;
    selected = floor(theta/(TWO_PI/N));
  }
}

function drawDisk()
{
  stroke(0);
  fill(255);
  ellipseMode(CENTER);
  ellipse(0,0,0.8*width,0.8*height);
  if (selected > -1){
    var st = selected-2;
    fill(100,255,100);
    arc(0,0,0.8*height,0.8*height,(st-0.5)*(TWO_PI/N),(st+0.5)*(TWO_PI/N));
  }
  let t = TWO_PI / N;
  for (var i=0; i<N; i++)
  {
    line(0,0,0,0.4*height);
    rotate(t/2);
    imageMode(CENTER);
    image(imgs[i],0,0.33*height,0.3*height*sin(t/2)*2*0.9);
    fill(255);

    textAlign(CENTER,CENTER);
    textSize(25);
    textStyle(BOLD);
    text(goodText[i],0,0.44*height);
    text(badText[i],0,0.48*height);
    rotate(t/2);
    
  }

}

function drawPtr()
{
  var w=0.01, h1=0.01,h2=0.2;
  push();
  rotate(theta);
  noStroke();
  fill(0);
  beginShape();
  vertex(0,0);
  vertex(-w*width,-h1*width);
  vertex(0,-h2*width);
  vertex(w*width,-h1*width);
  endShape(CLOSE);
  pop();

}