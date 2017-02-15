(function() {
	const sourceImagesPath = "source-images/";
	let eventsById = {};
	
	function firstEvent() {
		return eventsById[1];
	};
	
	function lastEvent() {
		return eventsById[count()];
	}
	
	function count() {
		return Object.keys(eventsById).length;
	};
	
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
	
	function checkIfExtraInfoExists(day) {
		return Object.keys(day).includes("extra-info");
	};
	
	function setupCurrentImage(currentImage, container, title, day, dayImage, hasFullContainer) {
		let url = (sourceImagesPath + currentImage.source);
		let img = new Image();
		let imageWrapper = document.createElement("div");
		let imageDescription = document.createElement("p");
		imageDescription.style.color = "#999999";
		if(!hasFullContainer) {
			imageWrapper.style.float = currentImage.alignment;
		}
		
		imageDescription.textContent = dayImage.description.text;
		appendTextPropertiesByNodeElement(imageDescription, dayImage.description, "left");
		imageWrapper.appendChild(img);
		imageWrapper.appendChild(imageDescription);
		img.addEventListener("load", function(ev) {
			let imgTarget = ev.currentTarget;
			let width = imgTarget.width;
			let height = imgTarget.height;
			parentContainer = container.parentNode;
			container.appendChild(imageWrapper);
			let halfWidth = 0;
			let halfHeight = 0;
			let parentContainerWidth = parseInt(
				extmdl.css.getStyleValueByElement(parentContainer, "width")) - 4;
			let parentContainerHeight = parseInt(
				extmdl.css.getStyleValueByElement(parentContainer, "height")) - 4;
			if(!hasFullContainer) {
				halfWidth = parentContainerWidth / 2;
				halfHeight = parentContainerHeight / 2;
				let oneSixteen = (halfWidth / 8);
				imageWrapper.style.width = halfWidth + "px";
				imageWrapper.style.height = (parentContainerHeight - 143) + "px";
				img.style.maxWidth = imageWrapper.style.maxWidth = (halfWidth - oneSixteen) + "px";
				img.style.marginTop = ((Math.abs(img.height - halfHeight) * 0.4)) + "px";
			} else {
				imageWrapper.style.width = (parentContainerWidth - 68) + "px";
				imageWrapper.style.height = (parentContainerHeight - 143) + "px";
				img.style.maxWidth = imageWrapper.style.maxWidth = parentContainerWidth + "px";
				img.style.maxHeight = imageWrapper.style.maxHeight = (parentContainerHeight - 143) + "px";
				let currentHeight = parseFloat(img.style.maxHeight);
				let percentageHeight = extmdl.handler.convertValueToPercentage(height, currentHeight);
				let currentWidth = (width * percentageHeight).toFixed(2);
				imageDescription.style.width = currentWidth + "px";
				img.style.display = "block";
				img.style.margin = imageDescription.style.margin = "auto";
			}
			
			if(checkIfExtraInfoExists(day) && !hasFullContainer) {
				let extraInfo = day["extra-info"];
				let extraInfoPage = document.createElement("div");
				extraInfoPage.style.height = (parentContainerHeight - 143) + "px";
				extraInfoPage.style.float = extraInfo.alignment;
				let extraInfoParagraph = document.createElement("p");
				extraInfoParagraph.style.paddingTop = "30px";
				extraInfoPage.style.display = "block";
				extraInfoPage.style.width = (halfWidth - 2) + "px";
				extraInfoPage.style.height = (halfHeight - 2) + "px";
				extraInfoParagraph.style.fontSize = (parseInt(title.size) - 10) + "px";
				extraInfoParagraph.textContent = extraInfo.text;
				extraInfoPage.appendChild(extraInfoParagraph);
				container.appendChild(extraInfoPage);
			}
		}, false);
		img.src = url;
		return imageWrapper;
	};
	
	function getImagePageContainerType(model) {
		let container = document.createElement("div");
		container.style.position = "relative";
		let day = model.day;
		let dayImages = day.images;
		let header = document.createElement("p");
		let title = model.day.title;
		header.textContent = title.text;
		appendTextPropertiesByNodeElement(header, title, "center");
		header.style.paddingBottom = "30px";
		if(dayImages.length === 1) {
			dayImages = dayImages[0];
			let currentImage = dayImages.image;
			let wrapper = setupCurrentImage(currentImage, container, title, day, dayImages, false);
			wrapper.style.display = "block";
		} else {
			let multipleImages = [];
			for(let i = 0; i < dayImages.length; i++) {
				let currentImage = dayImages[i].image;
				let wrapper = setupCurrentImage(currentImage, container, title, day, dayImages[i], true);
				wrapper.style.position = "absolute";
				wrapper.style.top = "60px";
				wrapper.style.left = 0;
				wrapper.style.display = i === 0 ? "block" : "none";
				wrapper.style.opacity = i !== 0 ? 0 : 1;
				multipleImages.push(wrapper);
			}
			
			extmdl.handler.getHandleOfMultipleImages(multipleImages);
		}
		
		container.appendChild(header);
		defaultContainerValue(container);
		return container;
	};
	
	return {
		getContainerByModel: function(model) {
			let container = null;
			switch(model.type) {
				case "image":
					container = getImagePageContainerType(model);
					container.setAttribute("model", "image");
					break;
				case "url":
					container = getIFrameContainerType(model);
					container.setAttribute("model", "url");
					break;
				case "text":
					container = getTextPageContainerType(model);
					container.setAttribute("model", "text");
					break;
			}
			
			return container;
		},
		setEventFrame: function(id, dayFrame) {
			eventsById[id] = dayFrame;
		},
		getFrameById: function(id) {
			return eventsById[id];
		},
		getFrameCount: function() {
			return count();
		},
		first: function() {
			return firstEvent();
		},
		last: function() {
			return lastEvent();
		}
	};
}());