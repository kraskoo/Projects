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
		element.style.fontSize = node.size + "px";
		if(node.bold === "true") element.style.fontWeight = "bold";
		if(node.italic === "true") element.style.fontStyle = "oblique";
		element.style.textAlign = textAlign;
	};
	
	function getTextPageContainerType(model) {
		let container = document.createElement("div");
		let font = model.font;
		let header = document.createElement("p");
		if(font !== "default") container.style.fontFamily = font;
		header.textContent = model.day.title.text;
		appendTextPropertiesByNodeElement(header, model.day.title, "center");
		header.style.paddingBottom = "40px";
		container.appendChild(header);
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
		let container = document.createElement("div");
		let dayImage = model.day.image;
		let header = document.createElement("p");
		let title = model.day.title;
		header.textContent = title.text;
		appendTextPropertiesByNodeElement(header, title, "center");
		let url = (sourceImagesPath + dayImage.source);
		let img = new Image();
		let imageWrapper = document.createElement("div");
		imageWrapper.style.display = "block";
		imageWrapper.appendChild(img);
		img.addEventListener("load", function() {
			parentContainer = container.parentNode;
			let parentContainerWidth = parseInt(
				extmdl.css.getStyleValueByElement(parentContainer, "width")) - 4;
			let parentContainerHeight = parseInt(
				extmdl.css.getStyleValueByElement(parentContainer, "height")) - 4;
			container.style.width = "100%";
			container.style.height = "100%";
			let halfWidth = parentContainerWidth / 2;
			let halfHeight = parentContainerHeight / 2;
			let oneSixteen = (halfWidth / 8);
			imageWrapper.style.width = halfWidth + "px";
			imageWrapper.style.height = (parentContainerHeight - 78) + "px";
			img.style.maxWidth = imageWrapper.style.maxWidth = (halfWidth - oneSixteen) + "px";
			img.style.marginTop = ((Math.abs(img.height - halfHeight) * 0.4)) + "px";
		}, false);
		img.src = url;
		container.appendChild(header);
		container.appendChild(imageWrapper);
		defaultContainerValue(container);
		return container;
	};
	
	return {
		getContainerByModel: function(model) {
			let container = null;
			switch(model.type) {
				case "image":
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