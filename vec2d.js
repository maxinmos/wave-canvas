function toRad(r) {
  return Math.PI * r / 180;
}

function distance({x, y}, {x: x1, y: y1}) {
  return Math.sqrt(
    Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2)
  );
}

function length({x, y}) {
  return distance({x, y}, {x: 0, y: 0});
}

function createVec2d(length, rad) {
  return {
    y: Math.sin(rad) * length,
    x: Math.cos(rad) * length,
    angle: rad
  };
}

function vec2d(x = 1, y = 0) {
  return {
    x: x,
    y: y,
    angle: 0
  };
}

module.exports = {
  toRad: toRad,
  createVec2d: createVec2d
};
