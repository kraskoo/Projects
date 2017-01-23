let parser = (function() {
	function parseXml(xml, onResponse) {
		let xmlType = xml.children[0].attributes.type.nodeValue;
		switch(xmlType) {
			case "text":
				parseTextPageXml(xml, onResponse);
				break;
			case "image":
				parseImagePageXml(xml, onResponse);
				break;
		}
	};
	
	function parseImagePageXml(xml, onResponse) {
		let page = {};
		let pageNode = xml.children[0];
		let attributes = pageNode.attributes;
		
		for(let i = 0; i < attributes.length; i++) {
			page[attributes[i].nodeName] = attributes[i].nodeValue;
		}
		
		let children = pageNode.children;
		for(let i = 0; i < children.length; i++) {
			page[children[i].nodeName] = {};
			let childAttributes = children[i].attributes;
			for(let j = 0; j < childAttributes.length; j++) {
				page[children[i].nodeName][childAttributes[j].nodeName] =
					childAttributes[j].nodeValue;
			}
			
			if(children[i].textContent !== "") {
				page[children[i].nodeName]["text"] = children[i].textContent;
			}
		}
		
		if(onResponse) {
			onResponse(page);
		}
	};
	
	function parseTextPageXml(xml, onResponse) {
		let page = {};
		page.paragraphs = [];
		let pageNode = xml.children[0];
		let attributes = pageNode.attributes;
		for(let i = 0; i < attributes.length; i++) {
			page[attributes[i].nodeName] = attributes[i].nodeValue;
		}
		
		let children = pageNode.children;
		for(let i = 0; i < children.length; i++) {
			
			if(children[i].nodeName !== "paragraph") {
				page[children[i].nodeName] = {};
				let childAttributes = children[i].attributes;
				for(let j = 0; j < childAttributes.length; j++) {
					page[children[i].nodeName][childAttributes[j].nodeName] =
						childAttributes[j].nodeValue;
				}
				
				if(children[i].textContent !== "") {
					page[children[i].nodeName]["text"] = children[i].textContent;
				}
			} else {
				let paragraph = {};
				let childAttributes = children[i].attributes;
				for(let j = 0; j < childAttributes.length; j++) {
					paragraph[childAttributes[j].nodeName] = childAttributes[j].nodeValue;
				}
				
				
				
				if(children[i].textContent !== "") {
					paragraph["text"] = children[i].textContent;
				}
				
				page.paragraphs.push(paragraph);
			}
		}
		
		if(onResponse) {
			onResponse(page);
		}
	};
	
	function redirectToXmlWorker(response, onResponse) {
		let domParser = new DOMParser();
		let xml = domParser.parseFromString(response, "application/xml");
		parseXml(xml, onResponse);
	};
	
	function redirectToJsonWorker(response, onResponse) {
		let json = JSON.parse(response);
		let jsonKeys = Object.keys(json);
		let jsonLength = jsonKeys.length;
		for(yearKey in json) {
			if(jsonLength !== 1 && parseInt(jsonKeys[0]) !== NaN) break;
			let year = json[yearKey];
			let yearAsNumber = parseInt(yearKey);
			let months = extmdl.timeLine.months;
			for(monthKey in months) {
				let month = months[monthKey];
				if(year[month] === undefined) {
					year[month] = {};
				}
				
				let monthIndex = timeLine.getMonthAsNumber(month);
				year[month]["index"] = monthIndex;
				year[month]["days"] = extmdl.timeLine.getDaysOfMonth(yearAsNumber, monthIndex - 1);
				if(Object.keys(year[months[monthIndex - 1]]).length > 2) {
					let currentMonth = (year[months[monthIndex - 1]]);
					for(dayKey in currentMonth) {
						if(dayKey !== "index" && dayKey !== "days") {
							let day = parseInt(dayKey);
							if(day < 1 || day > year[month]["days"]) {
								throw new Error("Day must be in month's range!");
							}
						}
					}
				}
			}
		}
		
		onResponse(json);
	};
	
	function redirectResponse(url, callback, onResponse) {
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", url, true);
		xhttp.send();
		xhttp.addEventListener("readystatechange", function() {
			if(xhttp.readyState === this.DONE && xhttp.status === 200) {
				callback(xhttp.response, onResponse);
			}
		}, false);
	};
	
	return {
		acceptXml: function(url, onParsedResponse) {
			redirectResponse(
				url,
				redirectToXmlWorker,
				onParsedResponse);
		},
		acceptJson: function(url, onParsedResponse) {
			redirectResponse(
				url,
				redirectToJsonWorker,
				onParsedResponse);
		}
	};
}());