window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
		function(callback, element){
			return window.setTimeout(callback, 1000 / 60);
		};
}());

window.cancelRequestAnimationFrame = (function() {
	return window.cancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		clearTimeout
}());

let animate;
(function(module) {
	module.moveElementTo = function(element, interval, toX = 0, toY = 0) {
		var style = element.getAttribute('style');
		var left = toX === 0 ? 0 : (parseFloat(str.leftStyleRegex.exec(style)[1]));
		var top = toY === 0 ? 0 : (parseFloat(str.topStyleRegex.exec(style)[1]));
		var elementProperties = {
			this: function(left, top) {
				elementProperties.left = left;
				elementProperties.top = top;
			}
		};
		
		elementProperties.constructor(3, 2)
		elementProperties.left = -10;
		
		console.log(elementProperties);
		
		var condition =
			((left !== 0 && top !== 0) ?
				(left < toX && top < toY) : (left !== 0 ? left < toX : top < toY));
		var stopped;
		var request = 0;
		var started;
		
		function loop() {
			if(!stopped) {
				if(left !== 0 && top !== 0) {
					style = style.replace(str.leftStyleRegex, ("left: " + (left + interval)));
					style = style.replace(str.topStyleRegex, ("top: " + (top + interval)));
					element.setAttribute('style', style);
					left = parseFloat(str.leftStyleRegex.exec(style)[1]);
					top = parseFloat(str.topStyleRegex.exec(style)[1]);
					condition = top < toY && left < toX;
					if(!condition) stop();
				} else if (left !== 0) {
					style = style.replace(str.leftStyleRegex, ("left: " + (left + interval)));
					element.setAttribute('style', style);
					left = parseFloat(str.leftStyleRegex.exec(style)[1]);
					condition = left < toX;
					if(!condition) stop();
				} else if (top !== 0) {
					style = style.replace(str.topStyleRegex, ("top: " + (top + interval)));
					element.setAttribute('style', style);
					top = parseFloat(str.topStyleRegex.exec(style)[1]);
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
			if(request) window.cancelRequestAnimationFrame(request);
			stopped = true;
		};
		
		start();
	};
	
	module.createTestDiv = function() {
		var div = document.createElement("div");
		div.style.width = "100px";
		div.style.height = "100px";
		div.style.backgroundColor = "black";
		div.style.position = "absolute";
		div.style.top = "50px";
		div.style.left = "50px";
		document.body.appendChild(div);
		return div;
	};
	
	animate = module;
	return module;
} (animate || {}));