(function() {
	const defaultCloseBox = "url('resources/images/closebox.svg') no-repeat 0 0";
	const defaultOpenBox = "url('resources/images/openbox.svg') no-repeat 0 0";
	let currentZoom, dividerPerZoomLevel, lastSelectedZIndex, normalZoom,
		zoomBound, zoomOnScroll, zoomButtonsOn;

	function initialize() {
		let settings = extmdl.initial.settings();
		dividerPerZoomLevel = settings["dividerPerZoomLevel"];
		normalZoom = settings["normalZoom"];
		zoomOnScroll = settings["zoomOnScroll"];
		zoomButtonsOn = settings["zoomButtonsOn"];
		zoomBound = Math.round(normalZoom / (dividerPerZoomLevel + 1));
		currentZoom = normalZoom;
		lastSelectedZIndex = 0;
	};
	
	function getCurrentZoom() {
		return currentZoom;
	};
	
	function initializeZoom() {
		let allInnerEvents = document.querySelectorAll("#inner-event");
		for(let i = 0; i < allInnerEvents.length; i++) {
			allInnerEvents[i].addEventListener("mouseover", function(ev) {
				let current = ev.currentTarget;
				current.style.background = defaultOpenBox;
				current.style.color = "black";
				lastSelectedZIndex = current.style.zIndex;
				current.style.zIndex = extmdl.timeLine.maxZIndex;
			}, false);
			allInnerEvents[i].addEventListener("mouseout", function(ev) {
				let current = ev.currentTarget;
				current.style.background = defaultCloseBox;
				current.style.color = "gray";
				current.style.zIndex = lastSelectedZIndex;
			}, false);
			let top = document.getElementById("top");
			allInnerEvents[i].addEventListener("click", function(ev) {
				if(top.childNodes.length > 0) top.removeChild(top.childNodes[0]);
				let current = ev.currentTarget;
				let dayEventId = parseInt(current.getAttribute("data-id"));
				let model = extmdl.repository.getDayById(dayEventId);
				let container = extmdl.data.getContainerByModel(model);
				top.appendChild(container);
			}, false);
		}
		
		let innerLine = document.getElementById("inner-line");
		if(zoomOnScroll) {
			innerLine.addEventListener("wheel", function(ev) {
				if(ev.deltaY < 0) {
					if(checkIfCanZoomIn()) {
						currentZoom = getLowerZoomLevel();
						extmdl.initial.resizeFrames(currentZoom, true, zoomBound);
					} 
				} else {
					if(checkIfCanZoomOut()) {
						currentZoom = getHigherZoomLevel();
						extmdl.initial.resizeFrames(currentZoom, false, zoomBound);
					} 
				}
			}, false);
		}
		
		if(zoomButtonsOn) {
			let zIn = document.createElement("div");
			zIn.setAttribute("class", "zoom-in");
			zIn.setAttribute("id", "zoom-in");
			let zOut = document.createElement("div");
			zOut.setAttribute("class", "zoom-out");
			zOut.setAttribute("id", "zoom-out");
			let zoomWrapper = document.createElement("div");
			document.getElementById("bottom").appendChild(zoomWrapper);
			zoomWrapper.setAttribute("id", "zoom");
			zoomWrapper.appendChild(zIn);
			zoomWrapper.appendChild(zOut);
			let zoomIn = document.getElementById("zoom-in");
			let zoomOut = document.getElementById("zoom-out");
			zIn.addEventListener("mouseover", function(ev) {
				if(checkIfCanZoomIn()) {
					let target = ev.currentTarget;
					extmdl.css.setZoomIn(target.classList);
				}
			}, false);
			zIn.addEventListener("mouseout", function(ev) {
				let target = ev.currentTarget;
				extmdl.css.unsetZoomIn(target.classList);
			}, false);
			zIn.addEventListener("click", function(ev) {
				let target = ev.currentTarget;
				if(checkIfCanZoomIn()) {
					extmdl.css.setZoomIn(target.classList);
					currentZoom = getLowerZoomLevel();
					extmdl.initial.resizeFrames(currentZoom, true, zoomBound);
				} 

				if(!checkIfCanZoomIn()) extmdl.css.unsetZoomIn(target.classList);
			}, false);
			zOut.addEventListener("mouseover", function(ev) {
				if(checkIfCanZoomOut()) {
					let target = ev.currentTarget;
					extmdl.css.setZoomOut(target.classList);
				}
			}, false);
			zOut.addEventListener("mouseout", function(ev) {
				let target = ev.currentTarget;
				extmdl.css.unsetZoomOut(target.classList);
			}, false);
			zOut.addEventListener("click", function(ev) {
				let target = ev.currentTarget;
				if(checkIfCanZoomOut()) {
					extmdl.css.setZoomOut(target.classList);
					currentZoom = getHigherZoomLevel();
					extmdl.initial.resizeFrames(currentZoom, false, zoomBound);
				} 
				
				if(!checkIfCanZoomOut()) extmdl.css.unsetZoomOut(target.classList);
			}, false);
		}
	};
	
	function checkIfCanZoomIn() {
		return currentZoom > zoomBound * Math.round(dividerPerZoomLevel / 2);
	};
	
	function checkIfCanZoomOut() {
		return currentZoom < (zoomBound * Math.round(dividerPerZoomLevel / 2)) + normalZoom;
	};
		
	function getLowerZoomLevel() {
		if(checkIfCanZoomIn()) {
			return currentZoom -= zoomBound;
		}
	};
	
	function getHigherZoomLevel() {
		if(checkIfCanZoomOut()) {
			return currentZoom += zoomBound;
		}
	};
	
	return {
		initialize: initialize,
		initializeZoom: initializeZoom,
		currentZoom: getCurrentZoom
	};
}());