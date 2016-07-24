/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var vec2d = __webpack_require__(1);
	var engine = __webpack_require__(2);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var load = function(cb) {
	  window.onload = cb;
	};

	var getAnimationFrame =
	  window.requestAnimationFrame ||
	  window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  window.oRequestAnimationFrame ||
	  window.msRequestAnimationFrame ||
	  function frame(callback) {
	    window.setTimeout(callback, 16.6);
	  };

	module.exports = {
	  load: load,
	  getAnimationFrame: getAnimationFrame
	};


/***/ }
/******/ ]);