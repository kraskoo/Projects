(function() {
	let bottom, clientXOnStart, innerLine, isMouseDown, lastFrameLeft, linewidth, middleOfScreen,
		onReleasePosition, onReleaseTime, onStartPosition, onStartTime, screenWidth,
		width, yearsLine, yearsLineBefore;
		
	function initialize() {
		isMouseDown = false;
		bottom = document.getElementById("bottom");
		innerLine = document.getElementById("inner-line");
		yearsLine = document.getElementById("years-line");
		yearsLineBefore = extmdl.css.pseudoStyleIfExists("#years-line::before");
		screenWidth = screen.width;
	};
	
	function initializeDependent() {
		lineWidth = bottom.scrollWidth;
		middleOfScreen = screen.width / 2;
		innerLine.style.left = -screenWidth + "px";
		yearsLine.style.left = -screenWidth + "px";
		yearsLineBefore.left = -screenWidth + "px";
		width = ((screenWidth * 2) + lineWidth);
		innerLine.style.width = width + "px";
		yearsLine.style.width = width + "px";
		yearsLineBefore.width = width + "px";
	};
	
	
	function initializeMovement() {
		initializeDependent();
		bottom.addEventListener("mousedown", onDownEvent, false);
		bottom.addEventListener("mouseup", onUpEvent, false);
		bottom.addEventListener("mousemove", onMoveEvent, false);
		bottom.addEventListener("mouseleave", resetMouseEvents, false);
	};
	
	function lowerBound() {
		return parseFloat(
			extmdl.css.getStyleValueByElement(extmdl.data.first(), "left")
		) - middleOfScreen - 4;
	};
	
	function upperBound() {
		let temproary = getLastFrameLeftPosition();
		if(lastFrameLeft !== undefined && temproary > lastFrameLeft) {
			width += (temproary - lastFrameLeft);
			innerLine.style.width = width + "px";
			yearsLine.style.width = width + "px";
			yearsLineBefore.width = width + "px";
		}
		
		lastFrameLeft = temproary;
		return lastFrameLeft - middleOfScreen + 4;
	};
	
	function getLineLeftPosition() {
		return parseFloat(innerLine.style.left);
	};
	
	function getLastFrameLeftPosition() {
		return parseFloat(
			extmdl.css.getStyleValueByElement(extmdl.data.last(), "left")
		);
	};
	
	function moveYearsLine(left) {
		yearsLine.style.left = left + "px";
		yearsLineBefore.left = -left + "px";
	};
	
	function onDownEvent(ev) {
		if(!isMouseDown) {
			onStartTime = ev.timeStamp;
			clientXOnStart = ev.clientX - innerLine.offsetLeft;
			isMouseDown = true;
		}
	};
	
	function onUpEvent(ev) {
		if(isMouseDown) {
			onReleaseTime = ev.timeStamp;
			console.log(onReleaseTime - onStartTime)
			isMouseDown = false;
		}
	};
	
	function onMoveEvent(ev) {
		if(isMouseDown) {
			let clientXOnMove = ev.clientX - clientXOnStart;
			let limit = clientXOnMove * -1;
			if(isInRange(limit)) {
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
	
	function isInRange(next) {
		return lowerBound() <= next && next <= upperBound()
	};
	
	function moveToRightIfIsNecessary() {
		let lineLeftPosition = getLineLeftPosition();
		let lastFrameLeft = getLastFrameLeftPosition() + lineLeftPosition;
		if(lastFrameLeft < middleOfScreen) {
			let difference = middleOfScreen - lastFrameLeft;
			innerLine.style.left = (lineLeftPosition + difference) + "px";
			yearsLine.style.left = (lineLeftPosition + difference) + "px";
			yearsLineBefore.left = ((lineLeftPosition * -1) - difference) + "px";
		}
	};
	
	return {
		initialize: initialize,
		initializeMovement: initializeMovement,
		screenWidth: function() {
			return screenWidth;
		},
		checkUpperBound: function() {
			moveToRightIfIsNecessary();
		}
	}
}());