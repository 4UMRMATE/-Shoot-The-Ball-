window.onload = function () {
  start();
};

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

var SCORE = 0;
var HIGHSCORE = 0;
var LIVES_LEFT = 5;

var GAME_OVER = false;
var missedShot = false;

function start() {
  drawBall();
  setTimer(animateBall, DELAY);

  drawAim();
  mouseMoveMethod(moveAim);

  mouseClickMethod(shotTarget);
}

function shotTarget(e) {
  if (GAME_OVER) {
    resetGame();
  }

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
  drawBall();
}

function resetGame() {
  GAME_OVER = false;
  remove(endGameBox);
  SCORE = 0;
  LIVES_LEFT = 5;
}

function endOfGame(color) {
  endGameBox = new Text("GAME OVER", "50px Impact");
  endGameBox.setColor(color);
  var endGameBox_X = getWidth() / 2 - endGameBox.getWidth() / 2;
  var endGameBox_Y = getHeight() / 2 - endGameBox.getHeight() / 2;
  endGameBox.setPosition(endGameBox_X, endGameBox_Y);
  add(endGameBox);

  GAME_OVER = true;
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
  var TEXT_HEIGHT = highScoreBox.getHeight();
  var TEXT_WIDTH = highScoreBox.getWidth();
  var RESTART_HEIGHT = restartBox.getHeight();
  var RESTART_WIDTH = restartBox.getWidth();

  scoreBox.setPosition(0, TEXT_HEIGHT);
  highScoreBox.setPosition(getWidth() - TEXT_WIDTH, TEXT_HEIGHT);
  livesBox.setPosition(0, getHeight() - RESTART_HEIGHT / 2);
  restartBox.setPosition(
    getWidth() - RESTART_WIDTH - 5,
    getHeight() - RESTART_HEIGHT / 2
  );

  add(scoreBox);
  add(highScoreBox);
  add(livesBox);
  add(restartBox);
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
  var ballRadius = getWidth() / 30;
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

function drawAim() {
  lineX1 = new Line(400 - 10, 400, 400, 400);
  lineX1.setColor(Color.red);
  add(lineX1);
  lineX2 = new Line(400, 400, 400 + 10, 400);
  lineX2.setColor(Color.red);
  add(lineX2);
  lineY1 = new Line(400, 400 - 10, 400, 400);
  lineY1.setColor(Color.red);
  add(lineY1);
  lineY2 = new Line(400, 400, 400, 400 + 10);
  lineY2.setColor(Color.red);
  add(lineY2);
}

function moveAim(e) {
  lineX1.setPosition(e.getX() - 15, e.getY());
  lineX1.setEndpoint(e.getX(), e.getY());
  lineX2.setPosition(e.getX(), e.getY());
  lineX2.setEndpoint(e.getX() + 15, e.getY());
  lineY1.setPosition(e.getX(), e.getY() - 15);
  lineY1.setEndpoint(e.getX(), e.getY());
  lineY2.setPosition(e.getX(), e.getY());
  lineY2.setEndpoint(e.getX(), e.getY() + 15);
}

function changeBackgroundColor() {
  var commentBox = document.querySelector(".comment");
  backgroundColor = Randomizer.nextColor();
  commentBox.style.backgroundColor = backgroundColor;
  commentBox.innerHTML = "New Level! (+0.5 speed)";
}
