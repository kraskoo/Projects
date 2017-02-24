(function() {
	const sourceImagesPath = "source-images/";
	const widthPadding = 68;
	const heightPadding = 143;
	
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
		if(node.bold === "true") element.style.fontWeight = "bold";
		if(node.italic === "true") element.style.fontStyle = "oblique";
		element.style.textAlign = textAlign;
	};
	
	function appendExtraInfo(container, day) {
		let extraInfo = day["extra-info"];
		let extraInfoPage = document.createElement("div");
		extraInfoPage.style.width = "30vw";
		extraInfoPage.style.float = extraInfo.alignment;
		extraInfoPage.style.paddingTop = "2.4vh";
		let extraInfoParagraph = document.createElement("p");
		extraInfoPage.style.display = "block";
		extraInfoParagraph.style.fontSize = "1vw";
		extraInfoParagraph.textContent = extraInfo.text;
		extraInfoPage.appendChild(extraInfoParagraph);
		container.appendChild(extraInfoPage);
	};
	
	function getTextPageContainerType(model) {
		let container = document.createElement("div");
		let font = model.font;
		let header = document.createElement("p");
		extmdl.css.setNormalText(header.classList);
		if(font !== "default") container.style.fontFamily = font;
		header.textContent = model.day.title.text;
		appendTextPropertiesByNodeElement(header, model.day.title, "center");
		header.style.fontSize = "1.6vw";
		header.style.paddingBottom = "2vh";
		container.appendChild(header);
		let paragraphs = model.day.paragraphs;
		for(let p = 0; p < paragraphs.length; p++) {
			let paragraph = document.createElement("p");
			extmdl.css.setNormalText(header.classList);
			appendTextPropertiesByNodeElement(paragraph, paragraphs[p], "justify");
			paragraph.style.fontSize = "0.8vw";
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
		imageDescription.classList.add("describe-text");
		if(!hasFullContainer) {
			imageWrapper.style.float = currentImage.alignment;
		}
		
		imageDescription.textContent = dayImage.description.text;
		appendTextPropertiesByNodeElement(imageDescription, dayImage.description, "left");
		imageDescription.style.fontSize = "0.85vw";
		imageWrapper.appendChild(img);
		imageWrapper.appendChild(imageDescription);
		img.addEventListener("load", function(ev) {
			let imgTarget = ev.currentTarget;
			let width = imgTarget.width;
			let height = imgTarget.height;
			let parentContainer = container.parentNode;
			let parentContainerWidth = parseFloat(
				extmdl.css.getStyleValueByElement(parentContainer, "width")) - 4;
			let parentContainerHeight = parseFloat(
				extmdl.css.getStyleValueByElement(parentContainer, "height")) - 4;
			if(checkIfExtraInfoExists(day) && !hasFullContainer) {
				imageWrapper.style.paddingTop = "2vh";
				imageWrapper.style.width = imgTarget.style.width = "30vw";
				appendExtraInfo(container, day);
			} else {
				imageWrapper.style.width = (parentContainerWidth - widthPadding) + "px";
				imageWrapper.style.height = (parentContainerHeight - heightPadding) + "px";
				imgTarget.style.maxHeight = imageWrapper.style.maxHeight = (parentContainerHeight - heightPadding) + "px";
				let currentHeight = parseFloat(imgTarget.style.maxHeight);
				let percentageHeight = extmdl.handler.convertValueToPercentage(height, currentHeight);
				let currentWidth = (width * (percentageHeight < 1 ? percentageHeight : 1)).toFixed(2);
				imageDescription.style.width = currentWidth + "px";
				imgTarget.style.display = "block";
				imgTarget.style.margin = imageDescription.style.margin = "auto";
			}
			
			container.appendChild(imageWrapper);
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
		extmdl.css.setNormalText(header.classList);
		let title = model.day.title;
		header.textContent = title.text;
		appendTextPropertiesByNodeElement(header, title, "center");
		header.style.fontSize = "1.6vw";
		if(dayImages.length === 1) {
			let dayImage = dayImages[0];
			let currentImage = dayImage.image;
			let wrapper = setupCurrentImage(currentImage, container, title, day, dayImage, false);
			wrapper.style.display = "block";
			wrapper.style.paddingTop = "2.4vh";
		} else {
			let multipleImages = [];
			for(let i = 0; i < dayImages.length; i++) {
				let currentImage = dayImages[i].image;
				let wrapper = setupCurrentImage(currentImage, container, title, day, dayImages[i], true);
				wrapper.style.position = "absolute";
				wrapper.style.top = "6vh";
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