(function(load) {
	function count(data) { return Object.keys(data).length; };
	
	function fetchJSONFile(path, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					var data = JSON.parse(httpRequest.responseText);
					if (callback) callback(data);
				}
			}
		};
		
		httpRequest.open('GET', path);
		httpRequest.send();
	};
	
	function loadScript(urls, callback) {
		if(!(urls instanceof Array)) {
			throw new Error('Instance of `urls` must be an Array type.');
		}
		
		for(var i = 0; i < urls.length; i++) {
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = urls[i];
			if(i < urls.length - 1) {
				script.onload = () => { return true; };
			} else if(i === urls.length - 1) {
				script.onreadystatechange = callback;
				script.onload = callback;
			}
			
			head.appendChild(script);
		}
	};
	
	function startUp() {
		if(hasLoadedData && hasLoadedSettings)
			loadScript(
				['resources/lib/css.extensions-module.js',
				'resources/lib/string.extensions-module.js',
				'resources/lib/math.extensions-module.js',
				'resources/lib/animate-module.js',
				'resources/lib/timeline-module.js'],
				() => load(yearObjects, settingObjects));
	};
	
	var yearObjects = [];
	var settingObjects = [];
	var hasLoadedData = false;
	var hasLoadedSettings = false;
		
	fetchJSONFile("resources/json/settings.json", function(jsonData) {
		var length = count(jsonData);
		for(var i = 0; i < length; i++) {
			settingObjects.push(jsonData);
			if(i == length - 1) hasLoadedSettings = true;
			startUp();
		}
	});
		
	var defaultJsonsPath = "resources/json/years/";
	fetchJSONFile("resources/json/initialize.json", function(jsonData) {
		var length = count(jsonData);
		for(var i = 0; i < length; i++) {
			var currentPath = defaultJsonsPath + Object.values(jsonData)[i];
			fetchJSONFile(currentPath, function(yearData) {
				var key = parseInt(Object.keys(yearData)[0]);
				yearObjects.push(yearData);
				if(yearObjects.length == length) hasLoadedData = true;
				startUp();
			});
		}
	});
} (function(data, setting) {
	setting = setting[0];
	(function() {
		var unsortedIndices = []
		for(var i = 0; i < data.length; i++) unsortedIndices.push(i);
		while(true) {
			var hasSorted = true;
			for(var i = 0; i < unsortedIndices.length; i++) {
				var current = data[i];
				for(var j = i + 1; j < unsortedIndices.length; j++) {
					var next = data[j];
					if(parseInt(Object.keys(current)) > parseInt(Object.keys(next))) {
						data[i] = next;
						data[j] = current;
						hasSorted = false;
					}
				}
			}
			
			if(hasSorted) break;
		}
	}());
	
	var framesSortOrder = setting["framesSortOrder"];
	var zIndex = 100000;
	if(framesSortOrder === "desc") {
		zIndex = 1000;
	}
	
	var lastFrameTopPosition = -2;
	var dayFrames = {};
	var currentlySelectedDates = [];
	var innerLineFrames = [];
	var yearFrames = [];
	var innerLine = document.getElementById("inner-line");
	var yearLine = document.getElementById("years-line");
	function renderYearAndEvents(dataObjs, indent) {
		var width = indent;
		var lastIndent = 0;
		for(obj in dataObjs) {
			var yearObject = dataObjs[obj];
			for(yearKey in yearObject) {
				var year = parseInt(yearKey);
				createFrame(year, lastIndent, width);
				dayFrames[yearKey] = {};
				var months = yearObject[yearKey];
				lastIndent += indent;
				for(monthKey in months) {
					dayFrames[yearKey][monthKey] = {};
					var monthAsNum = timeLine.getMonthAsNumber(monthKey);
					var dayInMonth = timeLine.getDaysOfMonth(year, monthAsNum);
					var days = months[monthKey];
					for(dayKey in days) {
						var day = parseInt(dayKey);
						if(checkIfDayIsInMonthDays(day, dayInMonth)) {
							var monthFootprints = indent / 12;
							var monthStartPosition = lastIndent - width - monthFootprints + (monthAsNum * monthFootprints);
							var monthEndPosition = (monthStartPosition + monthFootprints);
							var dayPosition = ((monthFootprints / dayInMonth) * day) + monthStartPosition;
							if(days[dayKey] instanceof Array) {
								var arr = days[dayKey];
								for(var i = 0; i < arr.length; i++) {
									if(arr[i] instanceof Object) {
										if(arr[i]["title"] !== undefined && arr[i]["source"] !== undefined) {
											createDayFrame(
												dayPosition,
												yearKey,
												monthKey,
												dayKey,
												arr[i]["source"],
												arr[i]["title"]);
										}
									}
								}
							} else if(days[dayKey] instanceof Object) {
								if(days[dayKey]["title"] !== undefined &&
									days[dayKey]["source"] !== undefined) {
									createDayFrame(
										dayPosition,
										yearKey,
										monthKey,
										dayKey,
										days[dayKey]["source"],
										days[dayKey]["title"]);
								}
							}
						}
					}
				}
			}
		}
	}
	
	var dividerPerZoomLevel = setting["dividerPerZoomLevel"];
	var normalZoom = setting["normalZoom"];
	var zoomOnScroll = setting["zoomOnScroll"];
	var zoomButtonsOn = setting["zoomButtonsOn"];
	var anyZoomBounds = Math.round(normalZoom / (dividerPerZoomLevel + 1));
	var currentZoom = normalZoom;
	renderYearAndEvents(data, currentZoom);
	var allInnerEvents = document.querySelectorAll("#inner-event");
	var lastSelectedZIndex = 0;
	var top = document.getElementById("top");
	for(var i = 0; i < allInnerEvents.length; i++) {
		allInnerEvents[i].addEventListener("mouseover", function(ev) {
			var current = ev.currentTarget;
			current.style.background = "url('resources/images/openbox.png')";
			current.style.color = "black";
			lastSelectedZIndex = current.style.zIndex;
			current.style.zIndex = timeLine.maxZIndex;
		}, false);
		allInnerEvents[i].addEventListener("mouseout", function(ev) {
			var current = ev.currentTarget;
			current.style.background = "url('resources/images/closebox.png')";
			current.style.color = "gray";
			current.style.zIndex = lastSelectedZIndex;
		}, false);
		allInnerEvents[i].addEventListener("click", function(ev) {
			if(top.childNodes.length > 0) top.removeChild(top.childNodes[0]);
			var current = ev.currentTarget;
			var iframe = document.createElement("iframe");
			iframe.setAttribute("src", current.getAttribute("source"));
			iframe.style.display = "none";
			var divContent = document.createElement("div");
			iframe.addEventListener("load", function(ev) {
				if(ev.target["contentDocument"] !== null) {
					var page = ev.target.contentDocument.childNodes[0];
					if(page.getAttribute("type") === "text") timeLine.createTextPage(page, divContent);
					top.appendChild(divContent);
					top.removeChild(iframe);
				} else {
					iframe.style.width = "100%";
					iframe.style.height = "100%";
					iframe.style.display = "block";
					iframe.setAttribute("frameborder", "0");
				}
			}, false);
			top.appendChild(iframe);
		}, false);
	}
	
	if(zoomOnScroll) {
		innerLine.addEventListener("wheel", function(ev) {
			if(ev.deltaY < 0) {
				if(checkIfCanZoomIn()) {
					currentZoom = getLowerZoomLevel();
					resizeFrames(currentZoom, true);
				} 
			} else {
				if(checkIfCanZoomOut()) {
					currentZoom = getHigherZoomLevel();
					resizeFrames(currentZoom, false);
				} 
			}
		}, false);
	}
	
	if(zoomButtonsOn) {
		var zIn = document.createElement("div");
		zIn.setAttribute("class", "zoom-in");
		zIn.setAttribute("id", "zoom-in");
		var zOut = document.createElement("div");
		zOut.setAttribute("class", "zoom-out");
		zOut.setAttribute("id", "zoom-out");
		var zoomWrapper = document.createElement("div");
		document.getElementById("bottom").appendChild(zoomWrapper);
		zoomWrapper.setAttribute("id", "zoom");
		zoomWrapper.appendChild(zIn);
		zoomWrapper.appendChild(zOut);
		var zoomIn = document.getElementById("zoom-in");
		var zoomOut = document.getElementById("zoom-out");
		zIn.addEventListener("mouseover", function(ev) {
			if(checkIfCanZoomIn()) {
				var target = ev.currentTarget;
				timeLine.setZoomIn(target.classList);
			}
		}, false);
		zIn.addEventListener("mouseout", function(ev) {
			var target = ev.currentTarget;
			timeLine.unsetZoomIn(target.classList);
		}, false);
		zIn.addEventListener("click", function(ev) {
			var target = ev.currentTarget;
			if(checkIfCanZoomIn()) {
				timeLine.setZoomIn(target.classList);
				currentZoom = getLowerZoomLevel();
				resizeFrames(currentZoom, true);
			} 

			if(!checkIfCanZoomIn()) timeLine.unsetZoomIn(target.classList);
		}, false);
		zOut.addEventListener("mouseover", function(ev) {
			if(checkIfCanZoomOut()) {
				var target = ev.currentTarget;
				timeLine.setZoomOut(target.classList);
			}
		}, false);
		zOut.addEventListener("mouseout", function(ev) {
			var target = ev.currentTarget;
			timeLine.unsetZoomOut(target.classList);
		}, false);
		zOut.addEventListener("click", function(ev) {
			var target = ev.currentTarget;
			if(checkIfCanZoomOut()) {
				timeLine.setZoomOut(target.classList);
				currentZoom = getHigherZoomLevel();
				resizeFrames(currentZoom, false);
			} 
			
			if(!checkIfCanZoomOut()) timeLine.unsetZoomOut(target.classList);
		}, false);
	}
	
	function getCurrentEventTopPosition() {
		if(lastFrameTopPosition === -2) {
			lastFrameTopPosition++;
			return "calc(13vh - 48px)";
		} else if(lastFrameTopPosition === -1) {
			lastFrameTopPosition++;
			return "calc(13vh - 61px)";
		} else if(lastFrameTopPosition === 0) {
			lastFrameTopPosition++;
			return "calc(13vh - 74px)";
		} else if(lastFrameTopPosition === 1) {
			lastFrameTopPosition = -2;
			return "calc(13vh - 87px)";
		}
	};
	
	function getLowerZoomLevel() {
		if(checkIfCanZoomIn()) {
			return currentZoom -= anyZoomBounds;
		}
	};
	
	function getHigherZoomLevel() {
		if(checkIfCanZoomOut()) {
			return currentZoom += anyZoomBounds;
		}
	};
	
	function checkIfCanZoomIn() {
		return currentZoom > anyZoomBounds * Math.round(dividerPerZoomLevel / 2);
	};
	
	function checkIfCanZoomOut() {
		return currentZoom < (anyZoomBounds * Math.round(dividerPerZoomLevel / 2)) + normalZoom;
	};
	
	function checkIfDayIsInMonthDays(day, upperBound) {
		return day > 0 && day < (upperBound + 1);
	};
	
	function createDayFrame(dayPosition, yearKey, monthKey, dayKey, source, title) {
		var dayFrame = document.createElement("div");
		dayFrame.setAttribute("id", "inner-event");
		dayFrame.setAttribute("alt", dayKey);
		dayFrame.style.top = getCurrentEventTopPosition();
		dayFrame.style.left = dayPosition + "px";
		if(framesSortOrder === "asc") {
			dayFrame.style.zIndex = zIndex--;
		} else if (framesSortOrder === "desc") {
			dayFrame.style.zIndex = zIndex++;
		}
		
		innerLine.appendChild(dayFrame);
		if(!timeLine.containsDotPosition(currentlySelectedDates, dayPosition, dayFrame)) createDotDayFrame(dayPosition);
		var paragraph = document.createElement("p");
		var dayDate = timeLine.getDateObject(dayKey, monthKey, yearKey);
		dayFrame.setAttribute(
			"title", (dayDate.day + " " + timeLine.getMonthAsBGNames(dayDate.month) + " " + dayDate.year + " г."));
		dayFrame.setAttribute("fTitle", title);
		paragraph.innerHTML = title;
		dayFrame.appendChild(paragraph);
		dayFrame.setAttribute("source", source);			
		dayFrames[yearKey][monthKey][dayKey] = dayFrame;
	};
	
	function createDotDayFrame(dotPosition) {
		var dotDayFrame = document.createElement("div");
		dotDayFrame.setAttribute("id", "dot-event");
		dotDayFrame.style.left = dotPosition + "px";
		yearLine.appendChild(dotDayFrame);
		currentlySelectedDates.push(dotDayFrame);
	};
	
	function createFrame(year, left, width) {
		var elementToAppend = document.getElementById("inner-line");
		var frame = document.createElement("div");
		frame.setAttribute("id", "frame");
		frame.style.left = left + "px";
		frame.style.width = width + "px";
		elementToAppend.appendChild(frame);
		innerLineFrames.push(frame);
		createYearFrame(year, (left + width - 3));
	};
	
	function createYearFrame(year, left) {
		var elementToAppend = document.getElementById("years-line");
		var yearFrame = document.createElement("div");
		yearFrame.setAttribute("id", "year-frame");
		yearFrame.innerHTML = year;
		yearFrame.style.left = left + "px";
		yearFrames.push(yearFrame);
		elementToAppend.appendChild(yearFrame);
	};
	
	function repositionFrame(index, newWidth, isSetToIncrease) {
		var style = innerLineFrames[index].getAttribute("style");
		var width = newWidth;
		var boundsByIndex = anyZoomBounds * index;
		var left = isSetToIncrease ?
			currentFrameLeft + boundsByIndex :
			currentFrameLeft - boundsByIndex;
		style = style.replace(/left:.*?(\d+)px;/, ("left: " + left + "px;"));
		style = style.replace(/width:.*?(\d+)px;/, ("width: " + width + "px;"));			
		var yearStyle = yearFrames[index].getAttribute("style");
		yearStyle = yearStyle.replace(/left:.*?(\d+)px;/, ("left: " + (left + width - 3) + "px;"));
		innerLineFrames[index].setAttribute("style", style);
		yearFrames[index].setAttribute("style", yearStyle);
	};
	
	function repositionEvents(newWidth) {
		var lastIndent = 0;
		var index = -1;
		for(year in dayFrames) {
			lastIndent += newWidth;
			for(monthKey in dayFrames[year]) {
				var monthAsNum = timeLine.getMonthAsNumber(monthKey);
				var dayInMonth = timeLine.getDaysOfMonth(year, monthAsNum);
				for(day in dayFrames[year][monthKey]) {
					var monthFootprints = newWidth / 12;
					var monthStartPosition = lastIndent - newWidth - monthFootprints + (monthAsNum * monthFootprints);
					var monthEndPosition = (monthStartPosition + monthFootprints);
					var framePosition = (monthFootprints / dayInMonth);
					var dayPosition = (framePosition * day) + monthStartPosition;
					dayFrames[year][monthKey][day].style.left = dayPosition + "px";
					currentlySelectedDates[++index].style.left = dayPosition + "px";
				}
			}
		}
	};
	
	var currentFrameLeft = 0;
	var currentFrameWidth = 0;
	function resizeFrames(newWidth, isSetToIncrease) {
		repositionEvents(newWidth);
		if(!isSetToIncrease) {
			for(var index = innerLineFrames.length - 1; index > -1; index--) {
				currentFrameLeft = parseInt(innerLineFrames[index].style.left);
				currentFrameWidth = parseInt(innerLineFrames[index].style.width);
				repositionFrame(index, newWidth, true);
			}
		} else {
			for(var index = 0; index < innerLineFrames.length; index++) {
				currentFrameLeft = parseInt(innerLineFrames[index].style.left);
				currentFrameWidth = parseInt(innerLineFrames[index].style.width);
				repositionFrame(index, newWidth, false);
			}
		}
		
		currentFrameLeft = 0;
		currentFrameWidth = 0;
	};
}));