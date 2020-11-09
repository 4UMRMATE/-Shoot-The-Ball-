window.onload = function () {
  start();
};

// TODO gameOver
// TODO pause

// This program draws a target that follows the mouse

var lineX1;
var lineX2;
var lineY1;
var lineY2;

var dot;
var ball;

var DELAY = 20;

var dx = 3;
var dy = 3;
var speed = 3;
var current_speed_x = 3;
var current_speed_y = 3;

var randColor;
var backgroundColor;

var endGameBox;
var scoreBox;
var highScoreBox;
var livesBox;
var restartBox;
var pauseBox;

var SCORE = 0;
var HIGHSCORE = 0;
var LIVES_LEFT = 5;

var missedShot = false;
var paused = false;

function start() {
  mouseMoveMethod(drawAim);

  drawBall();
  setTimer(animateBall, DELAY);

  mouseClickMethod(shotTarget);
}

function shotTarget(e) {
  //remove(ball);
  var obj = getElementAt(e.getX(), e.getY());
  if (obj !== null) {
    if (obj.type == "Circle") {
      missedShot = false;
      commentator();
      remove(obj);
      ++SCORE;
      if (SCORE > HIGHSCORE) {
        HIGHSCORE = SCORE;
      }

      makeGameChallenging();
    }

    if (obj.label == "RESTART") {
      endOfGame(backgroundColor);
      remove(ball);
      SCORE = 0;
      LIVES_LEFT = 5;
    } else if (obj.label == "PAUSE") {
      ballState();
    }
  } else {
    missedShot = true;
    remove(ball);
    commentator();
    if (LIVES_LEFT >= 0) {
      --LIVES_LEFT;
    } else {
      LIVES_LEFT = "Nope! :D";
    }
    if (LIVES_LEFT < 0) {
      endOfGame(Color.red);
    }
  }

  keepScore();
  if (paused == false) drawBall();
}

function endOfGame(color) {
  remove(endGameBox);
  endGameBox = new Text("GAME OVER", "50px Impact");
  endGameBox.setColor(color);
  var endGameBox_X = getWidth() / 2 - endGameBox.getWidth() / 2;
  var endGameBox_Y = getHeight() / 2 - endGameBox.getHeight() / 2;
  endGameBox.setPosition(endGameBox_X, endGameBox_Y);
  add(endGameBox);

  SCORE = -999;
}

function makeGameChallenging() {
  if (SCORE % 10 == 0) {
    speed += 0.5;
    dx = speed;
    dy = speed;

    changeBackgroundColor();
  }
}

function commentator() {
  var comment = document.querySelector(".comment");

  if (missedShot) {
    comment.innerHTML = "Ahh, so close!";
  } else {
    comment.innerHTML = "GG, Keep up the good work!";
  }
}

function keepScore() {
  var scoreCount = "SCORE: " + SCORE;
  var highScoreCount = "HIGH SCORE: " + HIGHSCORE;
  var livesCount = "LIVES LEFT: " + LIVES_LEFT;
  gameDetails(scoreCount, highScoreCount, livesCount, top);
}

function gameDetails(text1, text2, text3, corner) {
  remove(scoreBox);
  remove(highScoreBox);
  remove(livesBox);

  scoreBox = new Text(text1, "25px Ariall");
  highScoreBox = new Text(text2, "25px Ariall");
  restartBox = new Text("RESTART", "25px Ariall");
  livesBox = new Text(text3, "25px Ariall");
  pauseBox = new Text("PAUSE", "25px Ariall");
  var TEXT_HEIGHT = highScoreBox.getHeight();
  var TEXT_WIDTH = highScoreBox.getWidth();
  var RESTART_HEIGHT = restartBox.getHeight();
  var RESTART_WIDTH = restartBox.getWidth();
  var PAUSE_WIDTH = pauseBox.getWidth();

  scoreBox.setPosition(0, TEXT_HEIGHT);
  highScoreBox.setPosition(getWidth() - TEXT_WIDTH, TEXT_HEIGHT);
  livesBox.setPosition(0, getHeight() - RESTART_HEIGHT / 2);
  restartBox.setPosition(
    getWidth() - RESTART_WIDTH - 5,
    getHeight() - RESTART_HEIGHT / 2
  );
  pauseBox.setPosition(
    (getWidth() - PAUSE_WIDTH) / 2,
    getHeight() - RESTART_HEIGHT / 2
  );

  add(scoreBox);
  add(highScoreBox);
  add(livesBox);
  add(restartBox);
  add(pauseBox);
}

function animateBall() {
  checkWalls();
  ball.move(dx, dy);
}

function checkWalls() {
  // Bounce off right wall
  if (ball.getX() + ball.getRadius() > getWidth()) {
    dx = -dx;
  }

  // Bounce off left wall
  if (ball.getX() - ball.getRadius() < 0) {
    dx = -dx;
  }

  // Bounce off bottom wall
  if (ball.getY() + ball.getRadius() > getHeight()) {
    dy = -dy;
  }

  // Bounce off top wall
  if (ball.getY() - ball.getRadius() < 0) {
    dy = -dy;
  }
}

function drawBall() {
  var ballRadius = (getWidth() / getHeight()) * 25;
  randColor = Randomizer.nextColor();
  var randX = Randomizer.nextInt(ballRadius, getWidth() - ballRadius);
  var randY = Randomizer.nextInt(ballRadius, getHeight() - ballRadius);
  drawCircle(ballRadius, randColor, randX, randY);
}

function drawCircle(radius, color, x, y) {
  ball = new Circle(radius);
  ball.setColor(color);
  ball.setPosition(x, y);
  add(ball);
}

function drawAim(e) {
  drawLineX1(0, e.getY(), e.getX() - 5, e.getY());
  drawLineX2(e.getX() + 5, e.getY(), getWidth(), e.getY());
  drawLineY1(e.getX(), 0, e.getX(), e.getY() - 5);
  drawLineY2(e.getX(), e.getY() + 5, e.getX(), getHeight());
}

function drawLineX1(x1, y1, x2, y2) {
  remove(lineX1);
  lineX1 = new Line(x2 - 10, y1, x2, y2);
  lineX1.setColor(Color.red);
  add(lineX1);
}

function drawLineX2(x1, y1, x2, y2) {
  remove(lineX2);
  lineX2 = new Line(x1, y1, x1 + 10, y2);
  lineX2.setColor(Color.red);
  add(lineX2);
}

function drawLineY1(x1, y1, x2, y2) {
  remove(lineY1);
  lineY1 = new Line(x1, y2 - 10, x2, y2);
  lineY1.setColor(Color.red);
  add(lineY1);
}

function drawLineY2(x1, y1, x2, y2) {
  remove(lineY2);
  lineY2 = new Line(x1, y1, x2, y1 + 10);
  lineY2.setColor(Color.red);
  add(lineY2);
}

function ballState() {
  if (dx == 0 && dy == 0) {
    paused = false;
    dx = current_speed_x;
    dy = current_speed_y;
    ball.setColor(Randomizer.nextColor());
  } else {
    paused = true;
    dx = 0;
    dy = 0;
    ball.setColor(Randomizer.nextColor());
  }
}

function changeBackgroundColor() {
  var background = document.querySelector(".game-box");
  backgroundColor = Randomizer.nextColor();
  if (backgroundColor != randColor) {
    background.style.backgroundColor = backgroundColor;
  }
}
