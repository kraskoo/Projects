let extmdl = {};
(function(onRun) {
	// In my unpretentious view, this should called 'state machine' :)
	const settings = "resources/json/settings.json";
	const initialize = "resources/json/initialize.json";
	let pushedData = {};
	
	function initializing() {
		extmdl.parser.acceptJson(settings, (accepted) => { pushedData["settings"] = accepted; });
		extmdl.parser.acceptJson(initialize, (accepted) => { pushedData["initialize"] = accepted; });
		proceedOnLoad();
	};
	
	function checkLoadedFiles() {
		return Object.keys(pushedData).length === 2;
	};
	
	function checkData() {
		let data = pushedData["data"];
		for(year in data) {
			if(typeof(data[year]) !== "object") {
				return false;
			}
		}
		
		return extmdl
			.repository
			.checkDataFiles(() => { return Object.keys(pushed).length; });
	};
	
	function proceedOnLoad() {
		proceedLoading(checkLoadedFiles, onLoad);
	};
	
	function proceedOnRun() {
		proceedLoading(checkData, startup)
	}
	
	function onLoad() {
		pushedData["data"] = {};
		let pushed = pushedData["data"];
		let initializeYears = pushedData["initialize"];
		extmdl.repository.setYearsData(initializeYears, pushed);
		proceedOnRun();
	};
	
	function startup() {
		onRun(pushedData);
	};
	
	let moduleCount = 0;
	let moduleNames = [];

	function hasFullyLoadedModules() {
		let keys = Object.keys(extmdl);
		if(!(extmdl instanceof Object) || keys.length === 0) {
			return false;
		}
		
		for(mod in extmdl) {
			if(!(extmdl[mod] instanceof Object) || Object.keys(extmdl[mod]).length === 0) {
				return false;
			}
		}
		
		return countOfLoadedScripts() === moduleCount;
	};
	
	function extendModules(pathByNames) {
		moduleCount = Object.keys(pathByNames).length;
		for(module in pathByNames) {
			if(!moduleNames.includes(module)) {
				moduleNames.push(module);
				extmdl[module] = {};
				extendOn(pathByNames[module], extmdl[module]);
			}
		}
	};
	
	function setupModules() {
		extendModules({
			'animate': 'resources/lib/animate-module.js',
			'css': 'resources/lib/css.extensions-module.js',
			'data': 'resources/lib/data.service-module.js',
			'parser': 'resources/lib/parser.js',
			'repository': 'resources/lib/repository-module.js',
			'string': 'resources/lib/string.extensions-module.js',
			'timeLine': 'resources/lib/timeline-module.js',
			'view': 'resources/lib/view-module.js'
		});
		
		proceedToInitialState();
	};
	
	function proceedToInitialState() {
		proceedLoading(hasFullyLoadedModules, initializing);
	};
	
	setupModules();
} (function(data) {
	let settings = data.settings;
	data["dayFrames"] = {}
	let framesSortOrder = settings["framesSortOrder"];
	let zIndex = 100000;
	if(framesSortOrder === "desc") {
		zIndex = 1000;
	}
	
	let lastFrameTopPosition = -2;
	let currentlySelectedDates = [];
	let innerLineFrames = [];
	let yearFrames = [];
	let innerLine = document.getElementById("inner-line");
	let yearLine = document.getElementById("years-line");
	function renderYearAndEvents(indent) {
		let width = indent;
		let lastIndent = 0;
		let years = data.data;
		for(year in years) {
			data.dayFrames[year] = {};
			let currentYear = data.data[year];
			let yearDays = currentYear["yearDays"];
			let months = extmdl.timeLine.months;
			createFrame(year, lastIndent, width);
			lastIndent += indent;
			for(let m = 0; m < months.length; m++) {
				let month = months[m];
				let yearMonth = currentYear[month];
				if(typeof(yearMonth) === "object" && Object.keys(yearMonth).length > 1) {
					data.dayFrames[year][month] = {};
					let currentMonth = currentYear[month];
					let monthDays = currentMonth["days"];
					let monthFootprints = indent / 12;
					let monthStartPosition = lastIndent - width - monthFootprints + ((m + 1) * monthFootprints);
					let monthEndPosition = (monthStartPosition + monthFootprints);
					for(day in currentMonth) {
						if(typeof(currentMonth[day]) === "object") {
							let dayNum = Number(day);
							let dayPosition = ((monthFootprints / monthDays) * day) + monthStartPosition;
							let currentDay = currentMonth[day];
							let dayKeys = Object.keys(currentDay);
							if(dayKeys.includes("day-events")) {
								let dayEvents = currentDay["day-events"];
								for(let i = 0; i < dayEvents.length; i++) {
									createDayFrame(dayPosition, dayEvents[i], dayEvents[i]["id"]);
								}
							} else {
								createDayFrame(dayPosition, currentDay, currentDay["id"]);
							}
						}
					}
				}
			}
		}
	};
	
	function createDayFrame(dayPosition, day, id) {
		let date = day.date;
		let dayFrame = document.createElement("div");
		dayFrame.setAttribute("id", "inner-event");
		dayFrame.setAttribute("data-id", id);
		dayFrame.style.top = getCurrentEventTopPosition();
		dayFrame.style.left = dayPosition + "px";
		if(framesSortOrder === "asc") {
			dayFrame.style.zIndex = zIndex--;
		} else if (framesSortOrder === "desc") {
			dayFrame.style.zIndex = zIndex++;
		}
		
		innerLine.appendChild(dayFrame);
		if(!extmdl.timeLine.containsDotPosition(currentlySelectedDates, dayPosition, dayFrame)) {
			createDotDayFrame(dayPosition);
		}
		
		let paragraph = document.createElement("p");
		let dateMonth = extmdl.timeLine.getMonthAsBGNames(date.month);
		let dayFrameLabel = (date.day + " " + dateMonth + " " + date.year + " г.");
		dayFrame.setAttribute("title", dayFrameLabel);
		dayFrame.setAttribute("head-title", day.title);
		paragraph.innerHTML = day.title;
		dayFrame.appendChild(paragraph);
		data.dayFrames[date.year][date.month][date.day] = dayFrame;
	};
	
	function createDotDayFrame(dotPosition) {
		let dotDayFrame = document.createElement("div");
		dotDayFrame.setAttribute("id", "dot-event");
		dotDayFrame.style.left = dotPosition + "px";
		yearLine.appendChild(dotDayFrame);
		currentlySelectedDates.push(dotDayFrame);
	};
	
	function createFrame(year, left, width) {
		let elementToAppend = document.getElementById("inner-line");
		let frame = document.createElement("div");
		frame.setAttribute("id", "frame");
		frame.style.left = left + "px";
		frame.style.width = width + "px";
		elementToAppend.appendChild(frame);
		innerLineFrames.push(frame);
		createYearFrame(year, (left + width - 3));
	};
	
	function createYearFrame(year, left) {
		let elementToAppend = document.getElementById("years-line");
		let yearFrame = document.createElement("div");
		yearFrame.setAttribute("id", "year-frame");
		yearFrame.innerHTML = year;
		yearFrame.style.left = left + "px";
		yearFrames.push(yearFrame);
		elementToAppend.appendChild(yearFrame);
	};
	
	function repositionFrame(index, newWidth, isSetToIncrease) {
		let style = innerLineFrames[index].getAttribute("style");
		let width = newWidth;
		let boundsByIndex = anyZoomBounds * index;
		let left = isSetToIncrease ?
			currentFrameLeft + boundsByIndex :
			currentFrameLeft - boundsByIndex;
		style = style.replace(/left:.*?(\d+)px;/, ("left: " + left + "px;"));
		style = style.replace(/width:.*?(\d+)px;/, ("width: " + width + "px;"));			
		let yearStyle = yearFrames[index].getAttribute("style");
		yearStyle = yearStyle.replace(/left:.*?(\d+)px;/, ("left: " + (left + width - 3) + "px;"));
		innerLineFrames[index].setAttribute("style", style);
		yearFrames[index].setAttribute("style", yearStyle);
	};
	
	function repositionEvents(newWidth) {
		let lastIndent = 0;
		let index = -1;
		for(year in data.dayFrames) {
			lastIndent += newWidth;
			for(monthKey in data.dayFrames[year]) {
				let monthAsNum = extmdl.timeLine.getMonthAsNumber(monthKey);
				let dayInMonth = extmdl.timeLine.getDaysOfMonth(year, monthAsNum);
				for(day in data.dayFrames[year][monthKey]) {
					let monthFootprints = newWidth / 12;
					let monthStartPosition =
						lastIndent - newWidth - monthFootprints + (monthAsNum * monthFootprints);
					let monthEndPosition = (monthStartPosition + monthFootprints);
					let framePosition = (monthFootprints / dayInMonth);
					let dayPosition = (framePosition * day) + monthStartPosition;
					data.dayFrames[year][monthKey][day].style.left = dayPosition + "px";
					currentlySelectedDates[++index].style.left = dayPosition + "px";
				}
			}
		}
	};
	
	let currentFrameLeft = 0;
	let currentFrameWidth = 0;
	function resizeFrames(newWidth, isSetToIncrease) {
		repositionEvents(newWidth);
		if(!isSetToIncrease) {
			for(let index = innerLineFrames.length - 1; index > -1; index--) {
				currentFrameLeft = parseInt(innerLineFrames[index].style.left);
				currentFrameWidth = parseInt(innerLineFrames[index].style.width);
				repositionFrame(index, newWidth, true);
			}
		} else {
			for(let index = 0; index < innerLineFrames.length; index++) {
				currentFrameLeft = parseInt(innerLineFrames[index].style.left);
				currentFrameWidth = parseInt(innerLineFrames[index].style.width);
				repositionFrame(index, newWidth, false);
			}
		}
		
		currentFrameLeft = 0;
		currentFrameWidth = 0;
	};
	
	let dividerPerZoomLevel = settings["dividerPerZoomLevel"];
	let normalZoom = settings["normalZoom"];
	let zoomOnScroll = settings["zoomOnScroll"];
	let zoomButtonsOn = settings["zoomButtonsOn"];
	let anyZoomBounds = Math.round(normalZoom / (dividerPerZoomLevel + 1));
	let currentZoom = normalZoom;
	renderYearAndEvents(currentZoom);
	let allInnerEvents = document.querySelectorAll("#inner-event");
	let lastSelectedZIndex = 0;
	let top = document.getElementById("top");
	for(let i = 0; i < allInnerEvents.length; i++) {
		allInnerEvents[i].addEventListener("mouseover", function(ev) {
			let current = ev.currentTarget;
			current.style.background = "url('resources/images/openbox.png')";
			current.style.color = "black";
			lastSelectedZIndex = current.style.zIndex;
			current.style.zIndex = timeLine.maxZIndex;
		}, false);
		allInnerEvents[i].addEventListener("mouseout", function(ev) {
			let current = ev.currentTarget;
			current.style.background = "url('resources/images/closebox.png')";
			current.style.color = "gray";
			current.style.zIndex = lastSelectedZIndex;
		}, false);
		allInnerEvents[i].addEventListener("click", function(ev) {
			if(top.childNodes.length > 0) top.removeChild(top.childNodes[0]);
			let current = ev.currentTarget;
			let dayEventId = parseInt(current.getAttribute("data-id"));
			let model = extmdl.repository.getDayById(dayEventId);
			let container = extmdl.data.getContainerByModel(model);
			top.appendChild(container);
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
				resizeFrames(currentZoom, true);
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
				resizeFrames(currentZoom, false);
			} 
			
			if(!checkIfCanZoomOut()) extmdl.css.unsetZoomOut(target.classList);
		}, false);
	};
	
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
}));