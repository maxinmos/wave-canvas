var getAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function frame(callback) {
    window.setTimeout(callback, 16.6);
  };

var canvas;
var ctx;
var rotate = 0;
var radius = 20;

var vec = {
  toRad(r) {
    return Math.PI * r / 180;
  },
  distance({x, y}, {x: x1, y: y1}) {
    return Math.sqrt(
      Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2)
    );
  },
  length({x, y}) {
    return this.distance({x, y}, {x: 0, y: 0});
  },
  update(length, rad) {
    return {
      y: Math.sin(rad) * length,
      x: Math.cos(rad) * length,
      angle: rad
    };
  }
};

function vec2d(x = 1, y = 0) {
  return {
    x: x,
    y: y,
    angle: 0
  };
}

function gLength(x, average, maxL) {
  return maxL / average * (average - Math.abs(average - x));
}

function draw(ctx, width, height) {
  var waveLength = width;
  var innerRotate = rotate;
  var point = vec2d(radius, 0);
  var npoint;
  rotate = (rotate + 20) % 360;
  point = vec.update(
    gLength(waveLength, width / 2, 20),
    vec.toRad(innerRotate)
  );
  ctx.save();
  ctx.beginPath();
  ctx.translate(0, height / 2);
  ctx.moveTo(waveLength, point.y);
  while(waveLength > 0) {
    innerRotate = (innerRotate + 3) % 360;
    point = vec.update(
      gLength(waveLength, width / 2, 20),
      vec.toRad(innerRotate)
    );
    waveLength -= 1;
    ctx.lineTo(waveLength, point.y);
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function loop() {
  getAnimationFrame(function () {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    draw(ctx, canvas.clientWidth, canvas.clientHeight);
    loop();
  });
}

window.onload = function () {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  loop();
};
