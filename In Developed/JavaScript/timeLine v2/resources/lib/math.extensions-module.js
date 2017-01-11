let math;
(function(module) {
	let movableElement = {
		this.leftPosition;
		this.topPosition;
		setup: function(left, top) {
			this.leftPosition = left;
			this.topPosition = top;
		},
		left: function() {
			return this.leftPosition;
		},
		topPosition: function() {
			return this.topPosition;
		}
	};
	
	module.getTwoValuesAscInOrder = function(first, second) {
		if(second > first) return { first: second, second: first };
		return { first: first, second: second };
	};
	
	math = module;
	return module;
} (math || {}));