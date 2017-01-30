(function() {
	function replaceClassName(elementClassList, oldClass, newClass) {
		if((elementClassList instanceof DOMTokenList) && elementClassList.contains(oldClass)) {
			elementClassList.remove(oldClass);
			elementClassList.add(newClass);
		}
	};
	
	return {
		'setZoomIn': function(domTokenList) {
			replaceClassName(domTokenList, "zoom-in", "zoom-in-hover");
		},
		'setZoomOut': function(domTokenList) {
			replaceClassName(domTokenList, "zoom-out", "zoom-out-hover");
		},
		'unsetZoomIn': function(domTokenList) {
			replaceClassName(domTokenList, "zoom-in-hover", "zoom-in");
		},
		'unsetZoomOut': function(domTokenList) {
			replaceClassName(domTokenList, "zoom-out-hover", "zoom-out");
		},
		'getStyleValueByElement': function(element, val) {
			return window.getComputedStyle(element, null).getPropertyValue(val);
		}
	};
}());