let animate = (function() {
	return {
		'moveElementTo': function(element, interval, toX = 0, toY = 0) {
			let style = element.getAttribute('style');
			let left = toX === 0 ? 0 : (parseFloat(string.leftStyleRegex.exec(style)[1]));
			let top = toY === 0 ? 0 : (parseFloat(string.topStyleRegex.exec(style)[1]));
			let condition =
				((left !== 0 && top !== 0) ?
					(left < toX && top < toY) : (left !== 0 ? left < toX : top < toY));
			let stopped;
			let request = 0;
			let started;

			function loop() {
				if(!stopped) {
					if(left !== 0 && top !== 0) {
						style = style.replace(string.leftStyleRegex, ("left: " + (left + interval)));
						style = style.replace(string.topStyleRegex, ("top: " + (top + interval)));
						element.setAttribute('style', style);
						left = parseFloat(string.leftStyleRegex.exec(style)[1]);
						top = parseFloat(string.topStyleRegex.exec(style)[1]);
						condition = top < toY && left < toX;
						if(!condition) stop();
					} else if (left !== 0) {
						style = style.replace(string.leftStyleRegex, ("left: " + (left + interval)));
						element.setAttribute('style', style);
						left = parseFloat(string.leftStyleRegex.exec(style)[1]);
						condition = left < toX;
						if(!condition) stop();
					} else if (top !== 0) {
						style = style.replace(string.topStyleRegex, ("top: " + (top + interval)));
						element.setAttribute('style', style);
						top = parseFloat(string.topStyleRegex.exec(style)[1]);
						condition = top < toY;
						if(!condition) stop();
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
			};

			start();
		},
		'createTestDiv': function() {
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