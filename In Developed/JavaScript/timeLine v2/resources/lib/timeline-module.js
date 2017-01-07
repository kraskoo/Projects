let timeLine;
(function(module) {
	'use strict';
	
	const oneDay = 24 * 60 * 60 * 1000;
	const maxZIndex = 100001;
	
	module.maxZIndex = maxZIndex;
	
	module.getDayObject = function(title, source) {
		if(typeof(title) !== "string" || typeof(source) !== "string") {
			throw new TypeError("Instances of title and source must be string type.");
		}
		
		return { title: title, source: source };
	};
	
	module.setZoomIn = function(domTokenList) {
		replaceClassName(domTokenList, "zoom-in", "zoom-in-hover");
	};
	
	module.setZoomOut = function(domTokenList) {
		replaceClassName(domTokenList, "zoom-out", "zoom-out-hover");
	};
	
	module.unsetZoomIn = function(domTokenList) {
		replaceClassName(domTokenList, "zoom-in-hover", "zoom-in");
	};
	
	module.unsetZoomOut = function(domTokenList) {
		replaceClassName(domTokenList, "zoom-out-hover", "zoom-out");
	};
	
	function replaceClassName (elementClassList, oldClass, newClass) {
		if((elementClassList instanceof DOMTokenList) && elementClassList.contains(oldClass)) {
			elementClassList.remove(oldClass);
			elementClassList.add(newClass);
		}
	};
	
	module.createTextPage = function(page, divContent) {
		var font = page.getAttribute("font");
		var index = 1;
		var title = page.childNodes[index];
		var titleParagraph = document.createElement("p");
		titleParagraph.innerHTML = title.innerHTML;
		appendTextPropertiesByXmlElement(titleParagraph, title, font, "center");
		titleParagraph.style.paddingBottom = "40px";
		divContent.appendChild(titleParagraph);
		index += 2;
		while(page.childNodes[index] !== undefined) {
			var paragraph = document.createElement("p");
			var xmlParagraph = page.childNodes[index];
			appendTextPropertiesByXmlElement(paragraph, xmlParagraph, font, "justify");
			divContent.appendChild(paragraph);
			index += 2;
		}
	};
	
	function appendTextPropertiesByXmlElement(element, xml, font, textAlign) {
		element.innerHTML = xml.innerHTML;
		element.style.fontSize = xml.getAttribute("size") + "px";
		if(xml.getAttribute("bold") === "true") element.style.fontWeight = "bold";
		if(xml.getAttribute("italic") === "true") element.style.fontStyle = "oblique";
		if(font !== "default") element.style.fontFamily = font;
		element.style.textAlign = textAlign;
	};
	
	module.getMonthAsNumber = function(month) {
		switch(month) {
			case "january" : return 1;
			case "february" : return 2;
			case "march" : return 3;
			case "april" : return 4;
			case "may" : return 5;
			case "june" : return 6;
			case "july" : return 7;
			case "august" : return 8;
			case "september" : return 9;
			case "octomber" : return 10;
			case "november" : return 11;
			case "december" : return 12;
			default: throw new Error("Invalid month value exception.");
		}
	};
	
	module.getMonthAsBGNames = function(month) {
		switch(month) {
			case "january" : return "януари";
			case "february" : return "февруари";
			case "march" : return "март";
			case "april" : return "април";
			case "may" : return "май";
			case "june" : return "юни";
			case "july" : return "юли";
			case "august" : return "август";
			case "september" : return "септември";
			case "octomber" : return "октомври";
			case "november" : return "ноември";
			case "december" : return "декември";
			default: throw new Error("Invalid month cast value exception.");
		}
	};
	
	module.getDaysOfYear = function(year) {
		var firstDate = new Date(year, 1, 0);
		var secondDate = new Date(year, 12, 31);
		return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
	};
	
	module.getDaysOfMonth = function(year, month) {
		var monthStart = new Date(year, month, 1);
		var monthEnd = new Date(year, month + 1, 1);
		return Math.round((monthEnd - monthStart) / (oneDay));
	};
	
	timeLine = module;
	return module;
} (timeLine || {}));