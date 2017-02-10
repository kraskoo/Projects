/*
let div = extmdl.animate.createTestDiv();
let act = extmdl.animate
	.toX(div, 4, 400)
	.nextToX(3, 450)
	.nextToX(2, 500)
	.nextToX(1, 600)
	.nextToX(2, 50).start();
*/
(function() {
	function initialize() {
		window.requestAnimationFrame = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(func) { return setTimeout(func, 1000 / 60); };
		 
		window.cancelAnimationFrame = window.cancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			function(requestId) { clearTimeout(requestId); };
	};
	
	class Animation {
		constructor(config) {
			config = config || {};
			this.target = config.target || {};
			this.style = this.target.style || {};
			this.properties = config.properties || {};
			this.elapsed = 0;
			this.duration = config.duration || 0.0001;
			if(typeof config.easing === "string") {
				this.easing = extmdl.easings[config.easing];
			} else {
				this.easing = extmdl.easings["linear"];
			}
		}
	}
	
	let queue = [];
	let element;
	let currentAction;
	let index = -1;
	
	function dequeue() {
		if(index + 1 >= queue.length) {
			return null;
		}
		
		return queue[++index];
	};
	
	function toX(el, interval, x) {
		element = el;
		let request = 0;
		let stopped = true;
		let style = element.style;
		let left = parseFloat(style.left);
		let isSetToIncrease = left < x;
		let condition = isSetToIncrease ? left < x : left > x;

		function loop() {
			if(!stopped) {
				let nextLeft = isSetToIncrease ? left + interval : left - interval;
				style.left = nextLeft + "px";
				left = parseFloat(style.left);
				condition = isSetToIncrease ? left < x : left > x;
				if(!condition) {
					stop();
				}
				
				request = requestAnimationFrame(loop);
			}
		};

		function start() {
			request = requestAnimationFrame(loop);
			stopped = false;
		};
		
		function stop() {
			if(request) cancelAnimationFrame(request);
			stopped = true;
			let first = dequeue();
			if(first !== null) {
				let key = Object.keys(first)[0];
				let value = first[key];
				currentAction = toX(element, value, key);
				return currentAction.start();
			}
		};

		return {
			start: function() {
				start();
				return this;
			},
			stop: function() {
				stop();
				return this;
			}
		};
	};
	
	return {
		Animation: Animation,
		initialize: initialize,
		toX: function(element, interval, x) {
			currentAction = toX(element, interval, x);
			return this;
		},
		nextToX: function(interval, x) {
			queue.push({});
			queue[queue.length - 1][x] = interval;
			return this;
		},
		start: function() {
			return currentAction.start();
		},
		stop: function() {
			return currentAction.stop();
		},
		createTestDiv: function() {
			let div = document.createElement("div");
			div.style.width = "100px";
			div.style.height = "100px";
			div.style.backgroundColor = "black";
			div.style.position = "absolute";
			div.style.top = "50px";
			div.style.left = "50px";
			document.body.appendChild(div);
			return div;
		}
	}
}());