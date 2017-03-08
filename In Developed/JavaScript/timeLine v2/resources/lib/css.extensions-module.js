(function() {
	const mouseCursors = [ 'alias', 'all-scroll', 'auto', 'cell', 'context-menu', 'col-resize', 'copy',
			'crosshair', 'default', 'e-resize', 'ew-resize', 'grab', 'grabbing', 'help',
			'move', 'n-resize', 'ne-resize', 'nesw-resize', 'ns-resize', 'nw-resize', 'nw-resize',
			'no-drop', 'none', 'pointer', 'propress', 'row-resize', 's-resize', 'se-resize',
			'text', 'vertical-text', 'w-resize', 'wait', 'zoom-in', 'zoom-out', 'initial', 'inherit' ];
			
	function replaceClassName(elementClassList, oldClass, newClass) {
		if((elementClassList instanceof DOMTokenList)) {
			if(elementClassList.contains(oldClass)) {
				elementClassList.remove(oldClass);
			}
			
			elementClassList.add(newClass);
		}
	};
	
	function getMouseCursor(cursor) {
		if(typeof(cursor) !== "string") {
			throw new Error("The type of cursor must be `string` type.");
		}
		
		if(!mouseCursors.includes(cursor)) {
			throw new Error("The cursor that you select is not present in defualt css style.");
		}
		
		document.body.style.cursor = cursor;
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
	
	function getMainCss() {
		return document.head.children[2].sheet;
	};
	
	function initializeScreenArrows() {
		let previousArrowId = "#previous-arrow { position: absolute; }";
		let nextArrowId = "#next-arrow { position: absolute; }";
		let previousArrowNormalClass = ".previous-arrow-normal { left: 15px; }";
		let nextArrowNormalClass = ".next-arrow-normal { right: 15px; }";
		let previousArrowHoverClass = ".previous-arrow-hover { left: 0; }";
		let nextArrowHoverClass = ".next-arrow-hover { right: 0; }";
		getMainCss().insertRule(previousArrowId, 0);
		getMainCss().insertRule(nextArrowId, 1);
		getMainCss().insertRule(previousArrowHoverClass, 2);
		getMainCss().insertRule(nextArrowNormalClass, 3);
		getMainCss().insertRule(previousArrowNormalClass, 4);
		getMainCss().insertRule(nextArrowHoverClass, 5);
	};
	
	return {
		initializeScreenArrowsParts: initializeScreenArrows,
		getMouseCursor: getMouseCursor,
		getPackedScreenArrowElements: function() {
			return {
				previousArrowIdStyle: function() {
					return getMainCss().cssRules.item(0).style;
				},
				nextArrowIdStyle: function() {
					return getMainCss().cssRules.item(1).style;
				},
				previousHoverArrowClass: function() {
					return getMainCss().cssRules.item(2).style;
				},
				nextHoverArrowClass: function() {
					return getMainCss().cssRules.item(3).style;
				},
				previousArrowClassNormal: function() {
					return getMainCss().cssRules.item(4).style;
				},
				nextArrowClassNormal: function() {
					return getMainCss().cssRules.item(5).style;
				}
			}
		},
		setPreviousArrowOnHover: function(domTokenList) {
			replaceClassName(domTokenList, "previous-arrow-normal", "previous-arrow-hover");
		},
		setPreviousArrowOnNormal: function(domTokenList) {
			replaceClassName(domTokenList, "previous-arrow-hover", "previous-arrow-normal");
		},
		setNextArrowOnHover: function(domTokenList) {
			replaceClassName(domTokenList, "next-arrow-normal", "next-arrow-hover");
		},
		setNextArrowOnNormal: function(domTokenList) {
			replaceClassName(domTokenList, "next-arrow-hover", "next-arrow-normal");
		},
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