(function() {
	function replaceClassName(elementClassList, oldClass, newClass) {
		if((elementClassList instanceof DOMTokenList)) {
			if(elementClassList.contains(oldClass)) {
				elementClassList.remove(oldClass);
			}
			
			elementClassList.add(newClass);
		}
	};
	
	function pseudoStyleIfExists(selector) {
		let cssRules = document.styleSheets[0].cssRules;
		let index = -1;
		for(let i = 0; i < cssRules.length; i++) {
			if(typeof(cssRules[i].selectorText) === "string" &&
				extmdl.string.contains(cssRules[i].selectorText, selector)) {
				index = i;
				break;
			}
		}
		
		return index > -1 ? cssRules.item(index) : null;
	};
	
	return {
		setZoomIn: function(domTokenList) {
			replaceClassName(domTokenList, "zoom-in", "zoom-in-hover");
		},
		setZoomOut: function(domTokenList) {
			replaceClassName(domTokenList, "zoom-out", "zoom-out-hover");
		},
		unsetZoomIn: function(domTokenList) {
			replaceClassName(domTokenList, "zoom-in-hover", "zoom-in");
		},
		unsetZoomOut: function(domTokenList) {
			replaceClassName(domTokenList, "zoom-out-hover", "zoom-out");
		},
		setOpenbox: function(domTokenList) {
			replaceClassName(domTokenList, "closebox", "openbox");
		},
		setNormalText: function(domTokenList) {
			replaceClassName(domTokenList, "describe-text", "normal-text");
		},
		setClosebox: function(domTokenList) {
			replaceClassName(domTokenList, "openbox", "closebox");
		},
		setDescribeText: function(domTokenList) {
			replaceClassName(domTokenList, "normal-text", "describe-text");
		},
		getStyleValueByElement: function(element, val) {
			return window.getComputedStyle(element, null).getPropertyValue(val);
		},
		pseudoStyleIfExists: function(selector) {
			return pseudoStyleIfExists(selector);
		}
	};
}());