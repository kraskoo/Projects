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
	
	function createScreenArrowsIds() {
		let previousArrowId = "#previous-arrow { position: absolute; }";
		let nextArrowId = "#next-arrow { position: absolute; }";
		getMainCss().insertRule(previousArrowId, 0);
		getMainCss().insertRule(nextArrowId, 1);
		let previousArrowClassOnNonHover = ".previous-arrow-normal { left: 15px; cursor: default; }";
		let previousArrowClassOnHover = ".previous-arrow-hover { left: 0; cursor: pointer; }";
		let nextArrowClassOnNonHover = ".next-arrow-normal { right: 15px; cursor: default; }";
		let nextArrowClassOnHover = ".next-arrow-hover { right: 0; cursor: pointer; }";
		getMainCss().insertRule(previousArrowClassOnHover, 2);
		getMainCss().insertRule(nextArrowClassOnHover, 3);
		getMainCss().insertRule(previousArrowClassOnNonHover, 4);
		getMainCss().insertRule(nextArrowClassOnNonHover, 5);
	};
	
	return {
		createScreenArrowsIds: createScreenArrowsIds,
		getMouseCursor: getMouseCursor,
		getPreviousIdStyle: function() {
			return getMainCss().cssRules.item(0).style;
		},
		getNextIdStyle: function() {
			return getMainCss().cssRules.item(1).style;
		},
		getPreviousArrowClassNormal: function() {
			return getMainCss().cssRules.item(4).style;
		},
		getNextArrowClassNormal: function() {
			return getMainCss().cssRules.item(5).style;
		},
		getPreviousArrowClassOnHover: function() {
			return getMainCss().cssRules.item(2).style;
		},
		getNextArrowClassOnHover: function() {
			return getMainCss().cssRules.item(3).style;
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