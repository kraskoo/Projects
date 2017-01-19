let parser = (function() {
	function parseTextPageXml(xml, onResponse) {
		let page = {};
		page.children = {};
		let pageNode = xml.children[0];
		let attributes = pageNode.attributes;
		page.attributes = {};
		for(let i = 0; i < attributes.length; i++) {
			page.attributes[attributes[i].nodeName] = attributes[i].nodeValue;
		}
		
		let children = pageNode.children;
		for(let i = 0; i < children.length; i++) {
			if(children[i].nodeName === "title") {
				let title = children[i];
				let titleNode = {};
				let titleAttributes = title.attributes;
				for(let j = 0; j < titleAttributes.length; j++) {
					if(titleAttributes[j].nodeName === "size") {
						titleNode[titleAttributes[j].nodeName] = Number(titleAttributes[j].nodeValue);
					} else {
						titleNode[titleAttributes[j].nodeName] = Boolean(titleAttributes[j].nodeValue);
					}
				}
				
				page.children[children[i].nodeName] = titleNode;
			} else {
				if(page.children[children[i].nodeName] === undefined) {
					page.children[children[i].nodeName] = [];
				}
				
				let paragraph = children[i];
				let paragraphNode = {};
				let paragraphAttributes = paragraph.attributes;
				for(let j = 0; j < paragraphAttributes.length; j++) {
					if(paragraphNode[paragraphAttributes[j].nodeName] === "size") {
						paragraphNode[paragraphAttributes[j].nodeName] = Number(paragraphAttributes[j].nodeValue);
					} else {
						paragraphNode[paragraphAttributes[j].nodeName] = Boolean(paragraphAttributes[j].nodeValue);
					}
				}
				
				paragraphNode["text"] = children[i].textContent;
				page.children[children[i].nodeName].push(paragraphNode);
			}
		}
		
		if(onResponse) {
			onResponse(page);
		}
	};
	
	function redirectToXmlWorker(text, onResponse) {
		let domParser = new DOMParser();
		let xml = domParser.parseFromString(text, "application/xml");
		parseTextPageXml(xml, onResponse);
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
			redirectResponse(url, redirectToXmlWorker, onParsedResponse);
		},
		acceptJson: function(url, onParsedResponse) {
			redirectResponse(url, onParsedResponse);
		}
	};
}());