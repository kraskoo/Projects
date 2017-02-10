(function() {
	let afterMoveAction, bottom, canMove, clientXOnMove, clientXOnStart, elapsedTime, innerLine,
		isMouseDown, isMoveOnLeft, lastFrameLeft, linewidth, middleOfScreen, releasePosition,
		releaseTime, screenWidth, startPosition, startTime, width, yearsLine, yearsLineBefore;
		
	function initialize() {
		canMove = isMouseDown = isMoveOnLeft = false;
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
		yearsLineBefore.style.left = -screenWidth + "px";
		width = ((screenWidth * 2) + lineWidth);
		innerLine.style.width = width + "px";
		yearsLine.style.width = width + "px";
		yearsLineBefore.style.width = width + "px";
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
			yearsLineBefore.style.width = width + "px";
		}
		
		lastFrameLeft = temproary;
		return lastFrameLeft - middleOfScreen + 4;
	};
	
	function getLineLeftPosition() {
		return innerLine.offsetLeft;
	};
	
	function getLastFrameLeftPosition() {
		return parseFloat(
			extmdl.css.getStyleValueByElement(extmdl.data.last(), "left")
		);
	};
	
	function moveYearsLine(left) {
		yearsLine.style.left = left + "px";
		yearsLineBefore.style.left = -left + "px";
	};
	
	function onDownEvent(ev) {
		if(!isMouseDown) {
			clearAfterMove();
			startTime = extmdl.timeLine.getDateAsTimestampNextToMinute(new Date());
			startPosition = getLineLeftPosition();
			clientXOnStart = ev.clientX - startPosition;
			isMouseDown = true;
		}
	};
	
	function onMoveEvent(ev) {
		if(isMouseDown) {
			clientXOnMove = ev.clientX - clientXOnStart;
			let limit = clientXOnMove * -1;
			if(isInRange(limit)) {
				let lineOnLeft = getLineLeftPosition();
				innerLine.style.left = clientXOnMove + "px";
				moveYearsLine(clientXOnMove);
				isMoveOnLeft = startPosition < lineOnLeft;
				canMove = isMoveOnLeft ? distanceToStart() > 0 : distanceToEnd() < 0;
			}
		}
	};
	
	function onUpEvent(ev) {
		if(isMouseDown) {
			if(canMove) {
				releaseTime = extmdl.timeLine.getDateAsTimestampNextToMinute(new Date());
				elapsedTime = releaseTime - startTime;
				let lineOnLeft = getLineLeftPosition();
				releasePosition = lineOnLeft;
				let elapsed = releasePosition - startPosition;
				let afterMovePosition = elapsed * (elapsedTime * 0.006);
				if(isMoveOnLeft) {
					let toStart = distanceToStart();
					if(afterMovePosition > toStart) afterMovePosition = toStart + 2;
				} else {
					let toEnd = distanceToEnd();
					if(afterMovePosition < toEnd) afterMovePosition = toEnd - 2;
				}
				
				let newPosition = lineOnLeft + afterMovePosition;
				let interval = 15;
				afterMoveAction = (() => {
					extmdl.animate.toX(innerLine, interval, newPosition).start();
					extmdl.animate.toX(yearsLine, interval, newPosition).start();
					extmdl.animate.toX(yearsLineBefore, interval, -newPosition).start();
				})();
			} else clearAfterMove();
			
			isMouseDown = false;
		}
	};
	
	function clearAfterMove() {
		elapsedTime = 0;
		startTime = 0;
		releaseTime = 0;
		startPosition = 0;
		releasePosition = 0;
		canMove = false;
		isMoveOnLeft = false;
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
			yearsLineBefore.style.left = ((lineLeftPosition * -1) - difference) + "px";
		}
	};
	
	function canOpenBox(date) {
		return (extmdl.timeLine.getDateAsTimestampNextToMinute(date) - startTime < 100) ||
			startTime === 0;
	};
	
	function distanceToStart() {
		return -getLineLeftPosition() - 5 - lowerBound();
	};
	
	function distanceToEnd() {
		return -getLineLeftPosition() + 5 - upperBound();
	};
	
	return {
		canOpenBox: canOpenBox,
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