/*
let div = extmdl.animate.createTestDiv();
let act = extmdl.animate
	.toX(div, 4, 400)
	.nextToX(3, 450)
	.nextToX(2, 500)
	.nextToX(1, 600)
	.nextToX(2, 50).start();
	let innerLine = document.getElementById("inner-line");
	let ani = new extmdl.animate.Animation({
		target: innerLine,
		duration: 1000,
		properties: { opacity: { from: 1, to: 0 } },
		easing: "easeOutCubic"
	});
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
	
	function extend(obj, extension) {
		for(let key in extension) {
			obj[key] = extension[key];
		}
	};
	
	let Animation = function(config) {
		this.target = config.target || {};
		this.style = config.target.style;
		this.duration = config.duration || 0.0001;
		this.properties = config.properties || {};
		this.request = null;
		if(typeof(config.easing) === "string") { this.easing = extmdl.easings[config.easing]; }
		else { this.easing = extmdl.easings["linear"]; }
		for(prop in this.properties) {
			if(this.properties[prop]["to"] === undefined || this.properties[prop]["from"] === undefined) {
				throw new Error("The `to` and the `from` properties are mandatory.");
			}
			
			let to = this.properties[prop]["to"];
			let matchTo = to.toString().match(extmdl.string.measurementStyleRegex);
			if(matchTo !== null) this.properties[prop]["toUnit"] = matchTo[0];
			to = parseFloat(to);
			this.properties[prop]["to"] = to;
			let from = this.properties[prop]["from"];
			let matchFrom = from.toString().match(extmdl.string.measurementStyleRegex);
			if(matchFrom !== null) this.properties[prop]["fromUnit"] = matchFrom[0];
			from = parseFloat(from);
			this.properties[prop]["from"] = from;
			this.properties[prop]["current"] = from;
			let isSetToIncrease = this.properties[prop]["isSetToIncrease"];
			this.properties[prop]["isSetToIncrease"] = to > from;
			this.properties[prop]["change"] =
				isSetToIncrease ? from - to : to - from;
			this.properties[prop]["hasMeasurementUnit"] = this.properties[prop]["fromUnit"] !== undefined;
			this[prop] = {};
			this[prop] = this.properties[prop];
		}
	};
	
	Animation.prototype = {
		getTarget: function() {
			return this.target;
		},
		getStyle: function() {
			return this.style;
		},
		getDuration: function() {
			return this.duration;
		},
		getEasing: function() {
			return this.easing;
		},
		getRequest: function() {
			return this.request;
		},
		animate: function() {
			let self = this;
			let isStopped = true;
			let startTime = 0;
			let progress = 0;
			let timeFrameDuration = this.duration / 100;
			let currentFrame = 0;
			function resetClock(currentTime) {
				startTime = currentTime;
				currentFrame++;
			};
			
			function loop() {
				if(!isStopped) {
					for(prop in self.properties) {
						let currentTime =
							extmdl.timeLine.getDateAsTimestampNextToMinute(new Date()) - startTime;
						if(currentTime >= timeFrameDuration) {
							let percentage = timeFrameDuration * currentFrame * 0.1;
							console.log(percentage);
							self.progress =
								(self.easing(percentage,
									self.properties[prop].from,
									self.properties[prop].change,
									self.duration) / 100);
							self.properties[prop]["current"] +=
								(self.properties[prop]["change"] * (self.progress / 100));
							self.style[prop] =
								(self.properties[prop]["hasMeasurementUnit"] ?
									self.properties[prop]["current"] + self.properties[prop]["toUnit"] :
									self.properties[prop]["current"]);
							resetClock(currentTime);
						}
					}
					
					if(self.progress >= 1) stop();
					self.request = requestAnimationFrame(loop);
				}
			}
			
			function start() {
				startTime = extmdl.timeLine.getDateAsTimestampNextToMinute(new Date());
				isStopped = false;
				self.request = requestAnimationFrame(loop);
			}
			
			function stop() {
				if(self.request) cancelAnimationFrame(self.request);
				isStopped = true;
			}
			
			start();
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