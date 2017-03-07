/*
let div = extmdl.animate.createTestDiv();
let act = extmdl.animate
	.toX(div, 4, 400)
	.nextToX(3, 450)
	.nextToX(2, 500)
	.nextToX(1, 600)
	.nextToX(2, 50).start();
---------------------------------------               | 
Good example of that's how ease function works fine   |
---------------------------------------              \ /
let div = extmdl.animate.createTestDiv();             v
let a = new extmdl.animate.Animation({
	target: div,
	duration: 2500,
	properties: {
		top: {
			from: "150px",
			to: "400px"
		},
		left: {
			from: "100px",
			to: "300px"
		}
	},
	easing: "easeInElastic"
});
a.animate().start();
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
			this.target = config.target || {};
			this.style = config.target.style;
			this.duration = config.duration || 0.0001;
			this.properties = config.properties || {};
			this.request = null;
			if(typeof(config.easing) === "string") { this.easing = extmdl.easings[config.easing]; }
			else { this.easing = extmdl.easings["linear"]; }
			for(let prop in this.properties) {
				if(this.properties[prop]["to"] === undefined || this.properties[prop]["from"] === undefined) {
					throw new Error("The `to` and the `from` properties are mandatory.");
				}
				
				let to = this.properties[prop].to;
				let matchToAlphabet = to.toString().match(extmdl.string.alphabetRegex);
				let matchToDigit = to.toString().match(extmdl.string.digitRegex);
				if(matchToAlphabet !== null) {
					this.properties[prop].toUnit = matchToAlphabet[0];
					to = parseFloat(to);
				}
				
				if(matchToDigit === null) {
					to = this.properties[prop].to;
					this.properties[prop].toUnit = "none";
				}
				
				this.properties[prop].to = to;
				let from = this.properties[prop].from;
				let matchFromAlphabet = from.toString().match(extmdl.string.alphabetRegex);
				let matchFromDigit = from.toString().match(extmdl.string.digitRegex);
				if(matchFromAlphabet !== null) {
					this.properties[prop].fromUnit = matchFromAlphabet[0];
					from = parseFloat(from);
				}
				
				if(matchFromDigit === null) {
					from = this.properties[prop].from;
					this.properties[prop]["fromUnit"] = "none";
				}
				
				this.properties[prop]["from"] = this.properties[prop]["current"] = from;
				if(this.properties[prop]["fromUnit"] !== "none") {
					this.properties[prop]["isSetToIncrease"] = to > from;
					let isSetToIncrease = this.properties[prop]["isSetToIncrease"];
					this.properties[prop]["change"] =
						isSetToIncrease ? from - to : to - from;
				}
				
				this.properties[prop]["hasMeasurementUnit"] =
					this.properties[prop]["fromUnit"] !== undefined &&
					this.properties[prop]["fromUnit"] !== "none";
				this[prop] = {};
				this[prop] = this.properties[prop];
			}
		}
		
		animate() {
			let self = this;
			let isStopped = true;
			let startTime = 0;
			let startMilliseconds = 0;
			
			function loop() {
				if(!isStopped) {
					let currentTime =
						extmdl.timeLine
						.getDateAsTimestampNextToMinute(new Date())
						.result() - startTime - startMilliseconds;
					for(let prop in self.properties) {
						if(self.properties[prop].fromUnit !== "none") {
							self.progress = self.easing(currentTime, 0, 1, self.duration);
							self.properties[prop].current += (
								(self.properties[prop].to - self.properties[prop].current) * self.progress);
							self.style[prop] =
								(self.properties[prop].hasMeasurementUnit ?
									self.properties[prop].current + self.properties[prop].toUnit :
									self.properties[prop].current);
						}
					}
					
					if(self.progress >= 1 || currentTime > self.duration) stop();
					self.request = requestAnimationFrame(loop);
				}
			}
			
			function start() {
				let temproary = extmdl.timeLine.getDateAsTimestampNextToMinute(new Date());
				startMilliseconds = temproary.milliseconds();
				startTime = temproary.result();
				startTime -= startMilliseconds;
				isStopped = false;
				self.request = requestAnimationFrame(loop);
			}
			
			function stop() {
				if(self.request) cancelAnimationFrame(self.request);
				for(let prop in self.properties) {
					if(self.properties[prop].fromUnit === "none") {
						self.style[prop] = self.properties[prop].to;
					}
					
					if(parseInt(self.properties[prop].current) !== parseInt(self.properties[prop].to)) {
						self.properties[prop].current = self.properties[prop].to;
						self.style[prop] = self.properties[prop].current;
					}
				}
				
				isStopped = true;
			}
			
			return {
				start: start,
				stop: stop,
				isStopped: function() {
					return isStopped;
				}
			}
		}
	};
	
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

		function loop() {
			if(!stopped) {
				let nextLeft = isSetToIncrease ? left + interval : left - interval;
				style.left = nextLeft + "px";
				left = parseFloat(style.left);
				let condition = isSetToIncrease ? left < x : left > x;
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