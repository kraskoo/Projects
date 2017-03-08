(function() {
	function parseXml(xml, onResponse) {
		let xmlType = xml.children[0].attributes[0].value;
		switch(xmlType) {
			case "text":
				parseTextPageXml(xml, onResponse);
				break;
			case "image":
				parseImagePageXml(xml, onResponse);
				break;
		}
	};
	
	function apendChildrenToNode(children, page, nodeName, index) {
		let childAttributes = children[index].attributes;
		appendAttributesToNode(page[nodeName], childAttributes);
		if(children[index].textContent !== "") {
			page[nodeName]["text"] = children[index].textContent;
		}
	};
	
	function appendAttributesToNode(page, attributes) {
		for(let i = 0; i < attributes.length; i++) {
			let attributeName = attributes[i].nodeName;
			let attributeValue = attributes[i].nodeValue;
			page[attributes[i].nodeName] = attributes[i].nodeValue;
		}
	};
	
	function parseImagePageXml(xml, onResponse) {
		let page = {};
		let pageNode = xml.children[0];
		let attributes = pageNode.attributes;
		appendAttributesToNode(page, attributes);
		let children = pageNode.children;
		for(let i = 0; i < children.length; i++) {
			let nodeName = children[i].nodeName;
			if(children[i].attributes.length === 0) {
				page[nodeName] = [];
				let innerChildren = children[i].children;
				for(let j = 0, idx = 0; j < innerChildren.length; j += 2, idx++) {
					page[nodeName].push({});
					let imageName = innerChildren[j].nodeName;
					let descriptionName = innerChildren[j + 1].nodeName;
					page[nodeName][idx][imageName] = {};
					appendAttributesToNode(
						page[nodeName][idx][imageName],
						innerChildren[j].attributes);
					page[nodeName][idx][descriptionName] = {};
					appendAttributesToNode(
						page[nodeName][idx][descriptionName],
						innerChildren[j + 1].attributes);
					page[nodeName][idx][descriptionName]["text"] = innerChildren[j + 1].textContent;
				}
			} else {
				page[nodeName] = {};
				apendChildrenToNode(children, page, nodeName, i);
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
		page["type"] = pageNode.attributes["type"];
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
	
	function getHeaderByContentType(contentType) {
		if(typeof(contentType) !== "string") {
			throw new Error(
				"The function accept only one parameter in `string` type. Anything else is unacceptable or it is not nessesary.");
		}
		
		switch(contentType) {
			case "xml": return "application/xml";
			case "svg": return "image/svg+xml";
			default: throw new Error("Unknow content type.");
		}
	};
	
	function redirectToXmlWorker(response, onResponse, contentType = "xml") {
		let header = getHeaderByContentType(contentType);
			let domParser = new DOMParser();
			let xml = domParser.parseFromString(response, header);
		if(contentType === "xml") {
			parseXml(xml, onResponse);
		} else if(contentType === "svg") {
			xml.rootElement.style.fill = "rgb(0, 0, 255)";
			onResponse(xml);
		}
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
				
				let monthIndex = extmdl.timeLine.getMonthAsNumber(month);
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
	
	function redirectResponse(url, callback, onResponse, contentType = null) {
		let xhttp = new XMLHttpRequest();
		xhttp.addEventListener("readystatechange", function() {
			if(xhttp.readyState === this.DONE && xhttp.status === 200) {
				contentType === null ?
					callback(xhttp.response, onResponse) :
					callback(xhttp.response, onResponse, contentType);
			}
		}, false);
		xhttp.open("GET", url, true);
		xhttp.send(null);
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
		},
		acceptSvg: function(url, onParsedResponse) {
			redirectResponse(
				url,
				redirectToXmlWorker,
				onParsedResponse,
				"svg");
		}
	};
}());