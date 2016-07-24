var vec2d = require('./vec2d.js');
var engine = require('./engine.js');

var createVec2d = vec2d.createVec2d;
var toRad = vec2d.toRad;
var load = engine.load;
var getAnimationFrame = engine.getAnimationFrame;

var screenWidth;
var screenHeight;
var canvas;
var ctx;
var angle = 0;
var radius = 20;
var _ = {};

function gLength(width, padding, height, x) {
  var dx = x < padding ?
    x : width - x;
  return dx >= padding ?
    height : height / padding * dx;
}

function incAngle(angle, alpha) {
  return (angle + alpha) % 360;
}

function wave(ctx, width, padding) {
  var angle = 0;

  return function draw(height, dn, dSpeed) {
    var waveLength = width;
    var innerAngle = angle;
    var vector = function() {
      return createVec2d(
        gLength(width, padding, height, waveLength),
        toRad(innerAngle));
    };
    var point = vector();

    angle = incAngle(angle, dSpeed);

    ctx.beginPath();
    ctx.moveTo(waveLength, point.y);

    while (waveLength > 0) {
      innerAngle = incAngle(innerAngle, dn);
      waveLength -= 1;
      point = vector();
      ctx.lineTo(waveLength, point.y);
    }

    ctx.stroke();
    ctx.closePath();
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
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  screenWidth = canvas.clientWidth;
  screenHeight = canvas.clientHeight;

  var wave1 = wave(ctx, screenWidth, screenWidth / 4);
  var wave2 = wave(ctx, screenWidth, screenWidth / 4);
  var sHeight = swing(0, 25, 0.2);
  var sN = swing(2, 5, 0.01);
  var sSpeed = swing(6, 10, 0.02);

  (function loop() {
    getAnimationFrame(function () {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      ctx.save();
      ctx.translate(0, screenHeight / 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      wave1(15, 1.5, 5);
      ctx.restore();
      ctx.save();
      ctx.translate(0, screenHeight / 2);
      wave2(sHeight(), sN(), sSpeed());
      ctx.restore();
      loop();
    });
  })();
});
