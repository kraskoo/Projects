let css;
(function(module) {
	module.getStyleValueByElement = function(element, val) {
        return window.getComputedStyle(element, null).getPropertyValue(val);
    };
	
	css = module;
	return module;
} (css || {}));