let dataService = (function() {
	const sourceImagesPath = "source-images/";
	
	function getIFrameContainerType(model) {
		let iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.setAttribute("src", model.link);
		iframe.addEventListener("load", function() {
			defaultContainerValue(iframe);
			iframe.setAttribute("frameborder", "0");
		}, false);
		return iframe;
	};
	
	function defaultContainerValue(container) {
		container.style.width = "100%";
		container.style.height = "100%";
		container.style.display = "block";
	};
	
	function appendTextPropertiesByNodeElement(element, node, textAlign) {
		element.textContext = node.text;
		element.style.fontSize = node.size + "px";
		if(node.bold === "true") element.style.fontWeight = "bold";
		if(node.italic === "true") element.style.fontStyle = "oblique";
		element.style.textAlign = textAlign;
	};
	
	function getTextPageContainerType(model) {
		let container = document.createElement("div");
		let font = model.font;
		let titleParagraph = document.createElement("p");
		if(font !== "default") container.style.fontFamily = font;
		appendTextPropertiesByNodeElement(titleParagraph, model.day.title, "center");
		titleParagraph.textContent = model.title;
		titleParagraph.style.paddingBottom = "40px";
		container.appendChild(titleParagraph);
		let paragraphs = model.day.paragraphs;
		for(let p = 0; p < paragraphs.length; p++) {
			let paragraph = document.createElement("p");
			appendTextPropertiesByNodeElement(paragraph, paragraphs[p], "justify");
			paragraph.textContent = paragraphs[p].text;
			container.appendChild(paragraph);
		}
		
		defaultContainerValue(container);
		return container;
	};
	
	function getImagePageContainerType(model) {
		console.log(model);
		let container = document.createElement("div");
		let dayImage = model.day.image;
		let titleParagraph = document.createElement("p");
		let url = (sourceImagesPath + dayImage.source);
		console.log(url);
		let img = new Image();
		img.addEventListener("load", function() {
			
		}, false);
		img.src = url;
		img.width = dayImage.width;
		img.height = dayImage.height;
		container.appendChild(img);
		defaultContainerValue(container);
		return container;
	};
	
	return {
		getContainerByModel: function(model) {
			let container = null;
			switch(model.type) {
				case "image":
					console.log(model);
					container = getImagePageContainerType(model);
					break;
				case "url":
					container = getIFrameContainerType(model);
					break;
				case "text":
					container = getTextPageContainerType(model);
					break;
			}
			
			return container;
		}
	};
}());