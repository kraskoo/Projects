﻿(function() {
	let currentZoom, dividerPerZoomLevel, lastSelectedZIndex, normalZoom,
		middleLinePosition, screenWidth, zoomBound, zoomOnScroll, zoomButtonsOn;

	function initialize() {
		let settings = extmdl.initial.settings();
		dividerPerZoomLevel = settings["dividerPerZoomLevel"];
		normalZoom = settings["normalZoom"];
		screenWidth = extmdl.movement.screenWidth();
		middleLinePosition = (screenWidth / 2);
		zoomOnScroll = settings["zoomOnScroll"];
		zoomButtonsOn = settings["zoomButtonsOn"];
		zoomBound = Math.round(normalZoom / (dividerPerZoomLevel + 1));
		currentZoom = normalZoom;
		lastSelectedZIndex = 0;
	};
	
	function getCurrentZoom() {
		return currentZoom;
	};
	
	function setOpenbox(current) {
		let currentParagraph = current.childNodes[0];
		extmdl.css.setOpenbox(current.classList);
		extmdl.css.setNormalText(currentParagraph.classList);
	};
	
	function setClosebox(current) {
		let currentParagraph = current.childNodes[0];
		extmdl.css.setClosebox(current.classList);
		extmdl.css.setDescribeText(currentParagraph.classList);
	};
	
	function initializeZoom() {
		let allInnerEvents = document.querySelectorAll("#inner-event");
		for(let i = 0; i < allInnerEvents.length; i++) {
			allInnerEvents[i].addEventListener("mouseover", function(ev) {
				let current = ev.currentTarget;
				setOpenbox(current);
				lastSelectedZIndex = current.style.zIndex;
				current.style.zIndex = extmdl.timeLine.maxZIndex;
			}, false);
			allInnerEvents[i].addEventListener("mouseout", function(ev) {
				let current = ev.currentTarget;
				setClosebox(current);
				current.style.zIndex = lastSelectedZIndex;
			}, false);
			allInnerEvents[i].addEventListener("click", function(ev) {
				if(extmdl.movement.canOpenBox(new Date())) {
					extmdl.handler.handleTopContainer(ev);
				}
			}, false);
		}
		
		let innerLine = document.getElementById("inner-line");
		if(zoomOnScroll) {
			innerLine.addEventListener("wheel", function(ev) {
				if(ev.deltaY < 0) {
					if(checkIfCanZoomIn()) {
						currentZoom = getLowerZoomLevel();
						extmdl.initial.resizeFrames(currentZoom, true, zoomBound);
						extmdl.movement.checkUpperBound();
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
					extmdl.movement.checkUpperBound();
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