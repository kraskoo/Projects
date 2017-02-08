(function() {
	let afterMoveAction, bottom, clientXOnMove, clientXOnStart, elapsedTime, innerLine,
		isMouseDown, isMoveOnLeft, isMoved, lastFrameLeft, linewidth, middleOfScreen, releasePosition,
		releaseTime, screenWidth, startPosition, startTime, width, yearsLine, yearsLineBefore;
		
	function initialize() {
		isMouseDown = isMoveOnLeft = isMoved = false;
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
			let now = new Date();
			let minutes = now.getMinutes();
			let seconds = now.getSeconds();
			let miliseconds = now.getMilliseconds();
			startTime = parseInt(
				(extmdl.string.fixNumberLength(minutes, 2)) +
				(extmdl.string.fixNumberLength(seconds, 2)) +
				(extmdl.string.fixNumberLength(miliseconds, 3)));
			startPosition = getLineLeftPosition();
			clientXOnStart = ev.clientX - innerLine.offsetLeft;
			isMouseDown = true;
		}
	};
	
	function onMoveEvent(ev) {
		if(isMouseDown) {
			clientXOnMove = ev.clientX - clientXOnStart;
			let limit = clientXOnMove * -1;
			if(isInRange(limit)) {
				isMoveOnLeft = startPosition > getLineLeftPosition();
				isMoved = true;
				innerLine.style.left = clientXOnMove + "px";
				moveYearsLine(clientXOnMove);
			}
		}
	};
	
	function onUpEvent(ev) {
		if(isMouseDown) {
			if(isMoved) {
				let then = new Date();
				let minutes = then.getMinutes();
				let seconds = then.getSeconds();
				let miliseconds = then.getMilliseconds();
				releaseTime = parseInt(
					(extmdl.string.fixNumberLength(minutes, 2)) +
					(extmdl.string.fixNumberLength(seconds, 2)) +
					(extmdl.string.fixNumberLength(miliseconds, 3)));
				elapsedTime = releaseTime - startTime;
				let lineLeft = getLineLeftPosition();
				releasePosition = lineLeft * -1;
				startPosition *= -1;
				let elapsed = startPosition - releasePosition;
				let afterMovePosition = elapsed * (elapsedTime * 0.006);
				if(isMoveOnLeft) {
					let distanceToEnd = (lineLeft + upperBound());
					if(afterMovePosition + distanceToEnd < 0) afterMovePosition = distanceToEnd;
				} else {
					let distanceToStart = (lineLeft + lowerBound());
					if(distanceToStart + afterMovePosition > 0) afterMoveAction = distanceToStart;
					console.log(distanceToStart);
					console.log(afterMovePosition);
				}
				
				let newPosition = lineLeft + afterMovePosition;
				let interval = newPosition/200;
				afterMoveAction = () => {
					extmdl.animate.toX(innerLine, interval, newPosition).start();
					extmdl.animate.toX(yearsLine, interval, newPosition).start();
					extmdl.animate.toX(yearsLineBefore, interval, -newPosition).start();
				};
				afterMoveAction();
			}
			
			isMouseDown = false;
		}
	};
	
	function clearAfterMove() {
		elapsedTime = 0;
		startTime = 0;
		releaseTime = 0;
		startPosition = 0;
		releasePosition = 0;
		isMoved = false;
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