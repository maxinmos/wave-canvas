var vector = require('./vector.js');
var engine = require('./engine.js');

var load = engine.load;
var getAnimationFrame = engine.getAnimationFrame;
var vec2d = vector.vec2d;
var toRad = vector.toRad;

function increaseAngle(angle, alpha) {
  return (angle + alpha) % 360;
}

function wave(posX, posY, width, padding) {
  var angle = 0;

  var calculateWaveHeight = function(waveHeight, x) {
    var dx = x < padding ?
      x :
      width - x;

    return dx >= padding ?
     waveHeight :
     waveHeight / padding * dx;
  };

  var vec = function (waveHeight, x, angle) {
    return vec2d(
      calculateWaveHeight(waveHeight, x),
      toRad(angle));
  };

  return function draw(ctx, waveHeight, dNumber, dSpeed, style) {
    var x = width;
    var iAngle = angle;
    var point = vec(waveHeight, x, iAngle);

    angle = increaseAngle(angle, dSpeed);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = style.strokeStyle;
    ctx.lineWidth = style.lineWidth;
    ctx.save();
    ctx.translate(posX, posY);
    ctx.beginPath();
    ctx.moveTo(x, point.y);

    while (x > 0) {
      x -= 1;
      iAngle = increaseAngle(iAngle, dNumber);
      point = vec(waveHeight, x, iAngle);
      ctx.lineTo(x, point.y);
    }

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

function swing(min, max, delta) {
  var value = min;
  return function() {
    value += delta;
    if (value <= min || value >= max) {
      delta *= -1;
    }
    return value;
  }
}

load(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var screenWidth = canvas.clientWidth;
  var screenHeight = canvas.clientHeight;

  var wave1 = wave(0, screenHeight / 2, screenWidth, screenWidth / 4);
  var wave2 = wave(0, screenHeight / 2, screenWidth, screenWidth / 2);

  var sHeight = swing(0, 25, 0.2);
  var sNumber = swing(2, 5, 0.01);
  var sSpeed = swing(10, 20, 0.03);

  (function loop() {
    getAnimationFrame(function () {
      ctx.clearRect(0, 0, screenWidth, screenHeight);

      wave1(ctx, 15, 1.5, 5, {
        strokeStyle: 'rgba(0, 0, 0, 0.2)',
        lineWidth: 1
      });

      wave2(ctx, sHeight(), sNumber(), sSpeed(), {
        strokeStyle: 'rgba(0, 0, 0, 0.7)',
        lineWidth: 3
      });

      loop();
    });
  })();
});
