(function() {
	let queue = [];
	let element;
	let currentAction;
	
	function toX(el, interval, x) {
		element = el;
		let request = 0;
		let stopped = true;
		let style = element.getAttribute('style');
		let left = parseFloat(extmdl.string.leftStyleRegex.exec(style)[1]);
		let condition = left < x;

		function loop() {
			if(!stopped) {
				style = style.replace(extmdl.string.leftStyleRegex, ("left: " + (left + interval)));
				element.setAttribute('style', style);
				left = parseFloat(extmdl.string.leftStyleRegex.exec(style)[1]);
				condition = left < x;
				if(!condition) {
					stop();
				}
				
				request = window.requestAnimationFrame(loop);
			}
		};

		function start() {
			request = window.requestAnimationFrame(loop);
			stopped = false;
		};

		function stop() {
			if(request) window.cancelAnimationFrame(request);
			stopped = true;
			if(queue.length !== 0) {
				let queueLast = queue.pop();
				let key = Object.keys(queueLast)[0];
				let value = queueLast[key];
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