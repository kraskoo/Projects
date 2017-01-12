let css;
(function(module) {
	module.replaceClassName = function(elementClassList, oldClass, newClass) {
		if((elementClassList instanceof DOMTokenList) && elementClassList.contains(oldClass)) {
			elementClassList.remove(oldClass);
			elementClassList.add(newClass);
		}
	};
	
	module.setZoomIn = function(domTokenList) {
		module.replaceClassName(domTokenList, "zoom-in", "zoom-in-hover");
	};
	
	module.setZoomOut = function(domTokenList) {
		module.replaceClassName(domTokenList, "zoom-out", "zoom-out-hover");
	};
	
	module.unsetZoomIn = function(domTokenList) {
		module.replaceClassName(domTokenList, "zoom-in-hover", "zoom-in");
	};
	
	module.unsetZoomOut = function(domTokenList) {
		module.replaceClassName(domTokenList, "zoom-out-hover", "zoom-out");
	};
	
	module.getStyleValueByElement = function(element, val) {
        return window.getComputedStyle(element, null).getPropertyValue(val);
    };
	
	css = module;
	return module;
} (css || {}));