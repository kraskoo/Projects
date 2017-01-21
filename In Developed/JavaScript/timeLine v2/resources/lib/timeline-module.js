let timeLine = (function() {
	'use strict';
	
	const oneDay = 24 * 60 * 60 * 1000;
	const maxZIndex = 100001;
	
	function appendTextPropertiesByXmlElement(element, xml, font, textAlign) {
		element.innerHTML = xml.innerHTML;
		element.style.fontSize = xml.getAttribute("size") + "px";
		if(xml.getAttribute("bold") === "true") element.style.fontWeight = "bold";
		if(xml.getAttribute("italic") === "true") element.style.fontStyle = "oblique";
		if(font !== "default") element.style.fontFamily = font;
		element.style.textAlign = textAlign;
	};
	
	return {
		'oneDay': oneDay,
		'maxZIndex': maxZIndex,
		'getDayObject': function(title, source) {
			if(typeof(title) !== "string" || typeof(source) !== "string") {
				throw new TypeError("Instances of title and source must be string type.");
			}
			
			return { title: title, source: source };
		},
		'getDateObject': function(day, month, year) {
			if(typeof(day) !== "string" || typeof(month) !== "string" || typeof(year) !== "string") {
				throw new TypeError("Instances of day, month and year must be string type.");
			}
			
			return { day: Number(day), month: month, year: Number(year) };
		},
		'containsDotPosition': function(dates, position, frame) {
			return dates.length > 0 && parseInt(dates[dates.length - 1].style.left) === parseInt(frame.style.left);
		},
		'createTextPage': function(page, divContent) {
			let font = page.getAttribute("font");
			let index = 1;
			let title = page.childNodes[index];
			let titleParagraph = document.createElement("p");
			titleParagraph.innerHTML = title.innerHTML;
			appendTextPropertiesByXmlElement(titleParagraph, title, font, "center");
			titleParagraph.style.paddingBottom = "40px";
			divContent.appendChild(titleParagraph);
			index += 2;
			while(page.childNodes[index] !== undefined) {
				let paragraph = document.createElement("p");
				let xmlParagraph = page.childNodes[index];
				appendTextPropertiesByXmlElement(paragraph, xmlParagraph, font, "justify");
				divContent.appendChild(paragraph);
				index += 2;
			}
		},
		'getMonthAsNumber': function(month) {
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
		},
		'getMonthAsBGNames': function(month) {
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
		},
		'getDaysOfYear': function(year) {
			let firstDate = new Date(year, 1, 0);
			let secondDate = new Date(year, 12, 31);
			return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
		},
		'getDaysOfMonth': function(year, month) {
			let monthStart = new Date(year, month, 1);
			let monthEnd = new Date(year, month + 1, 1);
			return Math.round((monthEnd - monthStart) / (oneDay));
		}
	};
}());