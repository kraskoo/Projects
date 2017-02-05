(function() {
	const events = ["mousedown", "mouseup", "mousemove"];
	let bottom, lineLeft, lineWidth, isMouseDown, middleOfScreen, innerLine,
		clientXOnStart, yearsLine, yearsLineBefore, startPosition, lastFrameLeft, width;
		
	function initialize() {
		isMouseDown = false;
		bottom = document.getElementById("bottom");
		innerLine = document.getElementById("inner-line");
		yearsLine = document.getElementById("years-line");
		yearsLineBefore = extmdl.css.pseudoStyleIfExists("#years-line::before");
		lineLeft = bottom.scrollLeft;
		lineWidth = bottom.scrollWidth;
		let screenWidth = screen.width;
		middleOfScreen = screen.width / 2;
		startPosition = screenWidth;
		innerLine.style.left = -startPosition + "px";
		yearsLine.style.left = -startPosition + "px";
		yearsLineBefore.left = -startPosition + "px";
		width = ((screenWidth * 2) + lineWidth);
		innerLine.style.width = width + "px";
		yearsLine.style.width = width + "px";
		yearsLineBefore.width = width + "px";
	};
	
	function lowerBound() {
		return parseFloat(
			extmdl
			.css
			.getStyleValueByElement(
				extmdl.data.getFrameById(1),
				"left"
			)
		) - middleOfScreen - 4;
	};
	
	function upperBound() {
		let temproary = getLastFrameLeftPosition();
		if(lastFrameLeft !== undefined && lastFrameLeft !== temproary) {
			if(temproary > lastFrameLeft) {
				width += (temproary - lastFrameLeft);
				innerLine.style.width = width + "px";
				yearsLine.style.width = width + "px";
				yearsLineBefore.width = width + "px";
			}
		}
		
		lastFrameLeft = temproary;
		return lastFrameLeft - middleOfScreen + 4;
	};
	
	function getLastFrameLeftPosition() {
		return parseFloat(
			extmdl
			.css
			.getStyleValueByElement(
				extmdl
				.data
				.getFrameById(
					extmdl
					.data
					.getFrameCount()
				),
				"left"
			)
		);
	};
	
	function initializeMovement() {
		bottom.addEventListener("mousedown", onDownEvent, false);
		bottom.addEventListener("mouseup", onUpEvent, false);
		bottom.addEventListener("mousemove", onMoveEvent, false);
		bottom.addEventListener("mouseleave", resetMouseEvents, false);
	};
	
	function moveYearsLine(left) {
		yearsLine.style.left = left + "px";
		yearsLineBefore.left = -left + "px";
	};
	
	function moveEventFrames(left) {
		let count = extmdl.data.getFrameCount();
		for(let id = 1; id <= count; id++) {
			extmdl.data.getFrameById(id).style.left = left;
		}
	};
	
	function onDownEvent(ev) {
		if(!isMouseDown) {
			clientXOnStart = ev.clientX - innerLine.offsetLeft;
			isMouseDown = true;
		}
	};
	
	function onUpEvent(ev) {
		if(isMouseDown) {
			console.log(ev);
			isMouseDown = false;
		}
	};
	
	function onMoveEvent(ev) {
		if(isMouseDown) {
			let clientXOnMove = ev.clientX - clientXOnStart;
			let limit = clientXOnMove * -1;
			if(lowerBound() <= limit && limit <= upperBound()) {
				innerLine.style.left = clientXOnMove + "px";
				moveYearsLine(clientXOnMove);
			}
		}
	};
	
	function resetMouseEvents() {
		if(isMouseDown) {
			bottom.removeEventListener("mousedown", onDownEvent, false);
			bottom.removeEventListener("mouseup", onUpEvent, false);
			bottom.removeEventListener("mousemove", onMoveEvent, false);
			isMouseDown = false;
			bottom.addEventListener("mousedown", onDownEvent, false);
			bottom.addEventListener("mouseup", onUpEvent, false);
			bottom.addEventListener("mousemove", onMoveEvent, false);
		}
	};
	
	return {
		initialize: initialize,
		initializeMovement: initializeMovement,
		startPosition: function() {
			return startPosition;
		}
	}
}());