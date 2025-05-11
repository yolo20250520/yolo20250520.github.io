var w = 100;
var puppy, bunny;
const P=1;
const B=2;
const X=3;
var ctx;
var game;
var chkBox;
var btn;
function preload()
{
  puppy = loadImage('puppy.jpg');
  bunny = loadImage('bunny.jpg');
}
function setup()
{
  var canvas = createCanvas(500,300);
  canvas.mouseClicked(nm);
  ctx = createDiv('电脑是🐶，先走，你是🐰，后走。<br>轮到电脑的时候随便点一下，轮到你的时候想走哪点哪。');
  chkBox = createCheckbox('全自动', false);
  btn = createButton('再来再来');
  btn.mouseClicked(refresh);
  game = new Game();
}
function refresh() {
  game = new Game();
}
function nm()
{
  if (!chkBox.checked() && game.nextTurn == B) {
    var ii = round((mouseY - (150-w))/w);
    var jj = round((mouseX - 40)/w);

    [i,j] = game.findBunny();
    var nta = game.nextTurnAvailable(B);
    for (var idx=0; idx<nta.length;idx++) {
      if (nta[idx][2]==ii && nta[idx][3] == jj) {
        game.move([i,j,ii,jj]);
        return;
      }
    }
    console.log([ii,jj]);
    return;
  }
  var nta = shuffle(game.nextTurnAvailable(game.nextTurn));
  var bestScore = -Infinity;
  var bestMove;
  for (var idx = 0; idx < nta.length; idx++) {
    game.try(nta[idx]);
    score = game.score(8,B+P-game.nextTurn);
    game.undo(nta[idx]);
    if (game.nextTurn == P) {
      score = -score;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMove = nta[idx];
    }
  }
  game.move(bestMove);
}
function draw()
{
  translate(40,150);
  game.show();
}

function drawBoard()
{
  background(0);
  stroke(255);
  strokeWeight(10);
  point(0,0);
  point(4*w,0);
  for (var i=1;i<4;i++)
  {
    point(i*w,0);
    point(i*w,-w);
    point(i*w,+w);
  }
  strokeWeight(1);
  line(0,0,4*w,0);
  line(w,-w,3*w,-w);
  line(w,w,3*w,w);
  for (var i=1;i<4;i++) {
    line(i*w,-w,i*w,w);
  }
  line(0,0,w,w);
  line(0,0,w,-w);
  line(4*w,0,3*w,w);
  line(4*w,0,3*w,-w);
  line(w,-w,3*w,w);
  line(w,w,3*w,-w);
}
class Game {
  constructor() {
    this.board = [[X,P,0,0,X],[P,0,0,0,B],[X,P,0,0,X]];
    this.nextTurn = P;
    this.stepsRemain = 30;
  }



  nextStepAvailable(i,j) {
    var res = [];
    var _check = (i,j) => {
      if (i>=0 && i<3 && j>=0 && j < 5 && this.board[i][j] === 0) {
        res.push([i,j]);
      }
    }
    if (this.board[i][j] === P) {
      
      _check(i,j+1);
      _check(i+1,j);
      _check(i-1,j);
      if ((i+j) % 2 == 1) {
        for (var u of [-1, 1]) {
            _check(i+u,j+1);
        }
      }

    } else if (this.board[i][j] === B) {
      
      _check(i,j+1);
      _check(i,j-1);
      _check(i+1,j);
      _check(i-1,j);
      if ((i+j) % 2 == 1) {
        for (var u of [-1, 1]) {
          for (var v of [-1, 1]) {
            _check(i+u,j+v);
          }
        }
      }

    }

    return res;
  }

  findBunny() {
    for (var i=0; i<3; i++) {
      for (var j=0; j<5; j++) {
        if (this.board[i][j] == B) {
          return [i,j];
        }
      }
    }
  }

  nextTurnAvailable(side)
  {
    if (side == B) {
      for (var i=0; i < 3; i++) {
        for (var j=0; j<5; j++) {
          if (this.board[i][j] == B) {
            var res=this.nextStepAvailable(i,j);
            for (var k=0; k<res.length; k++) {
              res[k] = [i,j,res[k][0],res[k][1]];
            }
            return res;
          }
        }
      }
    } else {
      var res = [];
      for (var i=0; i<3; i++) {
        for (var j=0; j<5; j++) {
          if (this.board[i][j] == P) {
            var res1 = this.nextStepAvailable(i,j);
            for (var k=0; k<res1.length; k++) {
              res.push([i,j,res1[k][0],res1[k][1]]);
            }
          }
        }
      }
      return res;
    }
  }
  
  bunnyWins() {
    return this.board[1][0] == B || this.board[0][1] == B 
      || this.board[2][1] == B || this.stepsRemain <= 0;
  }

  score(depth, side) {
    if (depth == 0) {
      return 5-this.findBunny()[1];
    }

    var ntp = this.nextTurnAvailable(side);
    var sc;
    if (game.bunnyWins()) {
      return 10;
    }
    if(side == P) // minimize
    {
      sc = 10;
      for (var idx=0; idx<ntp.length; idx++) {
        game.try(ntp[idx]);
        sc = min(sc, game.score(depth-1, B+P-side));
        game.undo(ntp[idx]);
      }
    } else {
      sc = -10;
      for (var idx=0; idx<ntp.length; idx++) {
        game.try(ntp[idx]);
        sc = max(sc, game.score(depth-1, B+P-side));
        game.undo(ntp[idx]);      }
    }
    return sc;

  }

  move(mv) {
    // this.board[ii][jj] = this.board[i][j];
    // this.board[i][j] = 0;
    this.try(mv);
    this.nextTurn = B+P-this.nextTurn;
    if (this.board[1][0] == B || this.board[0][1] == B || this.board[2][1] == B) {
      console.log('bunny wins')
      ctx.html('Bunny wins.');

    }
    if (this.stepsRemain <= 0)
    {
      ctx.html('Bunny wins.')
    } else if (this.nextTurnAvailable(this.nextTurn).length == 0) {
      if (this.nextTurn == P) {
        console.log('bunny wins')
        ctx.html('Bunny wins.');
      } else {
        console.log('puppy wins')
        ctx.html('Puppy wins.');

      }
    } else {
      ctx.html('还剩'+this.stepsRemain+'步');
    }
  }

  try(mv) {
    this.stepsRemain -= 1;
    let tmp = this.board[mv[0]][mv[1]];
    this.board[mv[0]][mv[1]] = this.board[mv[2]][mv[3]];
    this.board[mv[2]][mv[3]] = tmp;
  }

  undo(mv) {
    this.stepsRemain += 1;
    let tmp = this.board[mv[0]][mv[1]];
    this.board[mv[0]][mv[1]] = this.board[mv[2]][mv[3]];
    this.board[mv[2]][mv[3]] = tmp;
  }

  show() {
    drawBoard();
    imageMode(CENTER);
    for (var i=0; i<3; i++) {
      for (var j=0; j<5; j++) {
        if (this.board[i][j] == P) {
          image(puppy, j*w, (i-1)*w, 50, 50);
        } else if (this.board[i][j] == B) {
          image(bunny, j*w, (i-1)*w, 50, 50);
        }
      }
    }
  }

}