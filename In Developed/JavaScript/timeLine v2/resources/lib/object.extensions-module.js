let lineObject;
(function(module) {
	class MovableObject {
		constructor(left, top) {
			this.left = left;
			this.top = top;
		}
	};
	
	module.getMovable = MovableObject;
	
	lineObject = module;
	return module;
} (lineObject || {}));