/*
 x       t          b              c            d
 |       |          |              |            |
null  elapsed  initialValue  amountOfChange  duration
         ^          ^              ^            ^
         +----------|----=unit=----|------------+
                    +----=unit=----+

In current case look like this:
	t           b           c           d
    |           |           |           |
currentTime   start       change     duration
t: current time, b: start value,
c: change in value, d: duration
(t and b can be frames or seconds/milliseconds)
Where:
	t = 0 (we’re just starting, so 0 seconds have passed)
	b = 50 (the beginning value of the property being tweened)
	c = 150 (the change in value – so the destination value of 200 minus the start value of 50 equals 150)
	d = 1 (total duration of 1 second)
	The functions returns float number between 0.. 1, which presenting percentage value of `progress`,
	for an example if progress is equal to 0.65, this means that the elapsed time = 65% of duration
	let div = extmdl.animate.createTestDiv();
	let ani = new extmdl.animate.Animation({
	target: div,
	duration: 3000,
	properties: {
		left: {
			from: "50px",
			to: "600px"
		}
	},
	easing: "easeOutExpo"});
	ani.animate();
*/
(function() {
	return {
		easeInQuad: function (t, b, c, d) {
			t /= d;
			return c*t*t + b;
		},
		easeOutQuad: function (t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad: function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t + b;
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		},
		easeInCubic: function (t, b, c, d) {
			t /= d;
			return c * t * t * t + b;
		},
		easeOutCubic: function (t, b, c, d) {
			t /= d;
			t--;
			return c * (t * t * t + 1) + b;
		},
		easeInOutCubic: function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t * t + b;
			t -= 2;
			return c / 2 * (t * t * t + 2) + b;
		},
		easeInQuart: function (t, b, c, d) {
			t /= d;
			return c * t * t * t * t + b;
		},
		easeOutQuart: function (t, b, c, d) {
			t /= d;
			t--;
			return -c * (t * t * t * t - 1) + b;
		},
		easeInOutQuart: function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t * t * t + b;
			t -= 2;
			return -c / 2 * (t * t * t * t - 2) + b;
		},
		easeInQuint: function (t, b, c, d) {
			t /= d;
			return c * t * t * t * t * t + b;
		},
		easeOutQuint: function (t, b, c, d) {
			t /= d;
			t--;
			return c * (t * t * t * t * t + 1) + b;
		},
		easeInOutQuint: function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t * t * t * t + b;
			t -= 2;
			return c / 2 * (t * t * t * t * t + 2) + b;
		},
		easeInSine: function (t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOutSine: function (t, b, c, d) {
			return -c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOutSine: function (t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},
		easeInExpo: function (t, b, c, d) {
			return c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOutExpo: function (t, b, c, d) {
			return c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOutExpo: function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			t--;
			return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
		},
		easeInCirc: function (t, b, c, d) {
			t /= d;
			return -c * (Math.sqrt(1 - t * t) - 1) + b;
		},
		easeOutCirc: function (t, b, c, d) {
			t /= d;
			t--;
			return c * Math.sqrt(1 - t * t) + b;
		},
		easeInOutCirc: function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			t -= 2;
			return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
		},
		easeInElastic: function (t, b, c, d) {
			let s = 1.70158; let p = 0; let a = c;
			if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
			if (a < Math.abs(c)) { a = c; s = p / 4; }
			else s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		easeOutElastic: function (t, b, c, d) {
			let s = 1.70158; let p = 0; let a = c;
			if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
			if (a < Math.abs(c)) { a = c; s = p / 4; }
			else s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		easeInOutElastic: function (t, b, c, d) {
			let s = 1.70158; let p = 0; let a = c;
			if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
			if (a < Math.abs(c)) { a = c; s = p / 4; }
			else s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		},
		easeInBack: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOutBack: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOutBack: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		easeInBounce: function (t, b, c, d) {
			return c - extmdl.easings.easeOutBounce(d - t, 0, c, d) + b;
		},
		easeOutBounce: function (t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
		},
		easeInOutBounce: function (t, b, c, d) {
			if (t < d / 2) return extmdl.easings.easeInBounce(t * 2, 0, c, d) * .5 + b;
			return extmdl.easings.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		},
		linear: function (t, b, c, d) {
			return c * t / d + b;
		}
	};
}());