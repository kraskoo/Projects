(function() {
	let currentFrameLeft, currentFrameWidth, currentlySelectedDates, data, dayFrames,
		framesSortOrder, innerLineFrames, lastFrameTopPosition, leftSideStartBound,
		settings, yearFrames, zIndex;
	
	function initialize(initData) {
		data = initData;
		settings = data.settings;
		currentFrameLeft = 0;
		currentFrameWidth = 0;
		currentlySelectedDates = [];
		data["dayFrames"] = {};
		dayFrames = data["dayFrames"];
		framesSortOrder = settings["framesSortOrder"];
		leftSideStartBound = settings.leftSideStartBound;
		zIndex = (framesSortOrder === "desc") ? 1000 : 100000;
		innerLineFrames = [];
		yearFrames = [];
		lastFrameTopPosition = -2;
	};
	
	function getSelectedDates() {
		return currentlySelectedDates;
	};
	
	function getSettings() {
		return settings;
	};
	
	function getLeftSideStartBound() {
		return leftSideStartBound;
	}
	
	function getInnerLineFrames() {
		return innerLineFrames;
	};
	
	function getYearFrames() {
		return yearFrames;
	};
	
	function getDayFrames() {
		return dayFrames;
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
	
	function resizeFrames(newWidth, isSetToIncrease, zoomBound) {
		repositionEvents(newWidth);
		if(!isSetToIncrease) {
			for(let index = innerLineFrames.length - 1; index > -1; index--) {
				currentFrameLeft = parseInt(innerLineFrames[index].style.left);
				currentFrameWidth = parseInt(innerLineFrames[index].style.width);
				repositionFrame(index, newWidth, true, zoomBound);
			}
		} else {
			for(let index = 0; index < innerLineFrames.length; index++) {
				currentFrameLeft = parseInt(innerLineFrames[index].style.left);
				currentFrameWidth = parseInt(innerLineFrames[index].style.width);
				repositionFrame(index, newWidth, false, zoomBound);
			}
		}
		
		currentFrameLeft = 0;
		currentFrameWidth = 0;
	};
	
	function repositionFrame(index, newWidth, isSetToIncrease, zoomBound) {
		let style = innerLineFrames[index].getAttribute("style");
		let width = newWidth;
		let boundsByIndex = zoomBound * index;
		let left = isSetToIncrease ?
			currentFrameLeft + boundsByIndex :
			currentFrameLeft - boundsByIndex;
		style = style.replace(extmdl.string.leftStyleRegex, ("left: " + left));
		style = style.replace(extmdl.string.widthStyleRegex, ("width: " + width));
		let yearStyle = yearFrames[index].getAttribute("style");
		yearStyle = yearStyle.replace(extmdl.string.leftStyleRegex, ("left: " + (left + width - 3)));
		innerLineFrames[index].setAttribute("style", style);
		yearFrames[index].setAttribute("style", yearStyle);
	};
	
	function repositionEvents(newWidth) {
		let lastIndent = leftSideStartBound;
		let index = -1;
		for(year in dayFrames) {
			lastIndent += newWidth;
			for(monthKey in dayFrames[year]) {
				let monthAsNum = extmdl.timeLine.getMonthAsNumber(monthKey);
				let dayInMonth = extmdl.timeLine.getDaysOfMonth(year, monthAsNum);
				for(day in dayFrames[year][monthKey]) {
					let monthFootprints = newWidth / 12;
					let monthStartPosition =
						lastIndent - newWidth - monthFootprints + (monthAsNum * monthFootprints);
					let monthEndPosition = (monthStartPosition + monthFootprints);
					let framePosition = (monthFootprints / dayInMonth);
					let dayPosition = (framePosition * day) + monthStartPosition;
					dayFrames[year][monthKey][day].style.left = dayPosition + "px";
					currentlySelectedDates[++index].style.left = dayPosition + "px";
				}
			}
		}
	};
	
	function renderYearAndEvents(indent) {
		let width = indent;
		let lastIndent = leftSideStartBound;
		let years = data.data;
		setupYears(indent, width, lastIndent, years);
	};
	
	function setupYears(indent, width, lastIndent, years) {
		for(year in years) {
			dayFrames[year] = {};
			let currentYear = data.data[year];
			let yearDays = currentYear["yearDays"];
			let months = extmdl.timeLine.months;
			createFrame(year, lastIndent, width);
			lastIndent += indent;
			for(let monthIndex = 0; monthIndex < months.length; monthIndex++) {
				let month = months[monthIndex];
				let yearMonth = currentYear[month];
				if(typeof(yearMonth) === "object" && Object.keys(yearMonth).length > 1) {
					setupFrames(year, month, yearMonth, monthIndex, indent, width, lastIndent);
				}
			}
		}
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
	
	function setupFrames(year, month, yearMonth, monthIndex, indent, width, lastIndent) {
		dayFrames[year][month] = {};
		let monthDays = yearMonth["days"];
		let monthFootprints = indent / 12;
		let monthStartPosition = lastIndent - width - monthFootprints + ((monthIndex + 1) * monthFootprints);
		let monthEndPosition = (monthStartPosition + monthFootprints);
		for(day in yearMonth) {
			if(typeof(yearMonth[day]) === "object") {
				let dayNum = Number(day);
				let dayPosition = ((monthFootprints / monthDays) * day) + monthStartPosition;
				let currentDay = yearMonth[day];
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
		
		let innerLine = document.getElementById("inner-line");
		innerLine.appendChild(dayFrame);
		if(!extmdl.timeLine.containsDotPosition(currentlySelectedDates, dayPosition, dayFrame)) {
			createDotDayFrame(dayPosition);
		}
		
		let paragraph = document.createElement("p");
		let dateMonth = extmdl.timeLine.getMonthAsBGName(date.month);
		let dayFrameLabel = (date.day + " " + dateMonth + " " + date.year + " г.");
		dayFrame.setAttribute("title", dayFrameLabel);
		dayFrame.setAttribute("head-title", day.title);
		paragraph.innerHTML = day.title;
		dayFrame.appendChild(paragraph);
		dayFrames[date.year][date.month][date.day] = dayFrame;
	};
	
	function createDotDayFrame(dotPosition) {
		let dotDayFrame = document.createElement("div");
		let yearLine = document.getElementById("years-line");
		dotDayFrame.setAttribute("id", "dot-event");
		dotDayFrame.style.left = dotPosition + "px";
		yearLine.appendChild(dotDayFrame);
		currentlySelectedDates.push(dotDayFrame);
	};
	
	return {
		initialize: function(initData) {
			initialize(initData);
		},
		renderYearAndEvents: function(indent) {
			renderYearAndEvents(indent);
		},
		resizeFrames: function(newWidth, isSetToIncrease, zoomBound) {
			resizeFrames(newWidth, isSetToIncrease, zoomBound);
		},
		currentlySelectedDates: getSelectedDates,
		dayFrames: getDayFrames,
		innerLineFrames: getInnerLineFrames,
		settings: getSettings,
		leftSideStartBound: getLeftSideStartBound,
		yearFrames: getYearFrames
	};
}());