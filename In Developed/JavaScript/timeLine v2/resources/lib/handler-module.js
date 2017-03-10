(function() {
	let changeFrameMoveAction, changeImageAction, currentFrameIndex, currentImageIndex,
		multipleImageCollection, hasHoverNextArrow, hasHoverPreviousArrow, nextArrowId, nextArrowBound,
		previousArrowBound, previousArrowId, permittedHeight, previousFrame, lastSelectedFrame, hasHoveredFrame,
		selectionZIndex, topContainer;
		
	function initialize() {
		hasHoverNextArrow = false;
		hasHoverPreviousArrow = false;
		nextArrowBound = null;
		previousArrowBound = null;
		changeImageAction = null;
		currentFrameIndex = -1;
		topContainer = document.getElementById("top");
		resetCurrentImageCollection();
		listenTopContainerOnClick();
		selectionZIndex = extmdl.timeLine.maxZIndex + 1;
		hasHoveredFrame = false;
		lastSelectedFrame = null;
		previousFrame = null;
		changeFrameMoveAction = null;
	};
	
	function handleTopContainer(currentFrame, dayEventId) {			
		if(topContainer.childNodes.length > 0) topContainer.removeChild(topContainer.childNodes[0]);
		removeFramesHandler();
		getBackToNormalStateLastFrame();
		getHandleOfPreviousFrameId(dayEventId);
		getHandleMovementToNextFrame(currentFrame);
		currentFrame.style.zIndex = selectionZIndex;
		setOpenbox(currentFrame);
		getFramesHandler();
		let model = extmdl.repository.getDayById(dayEventId);
		let modelContent = extmdl.data.getContainerByModel(model);
		topContainer.appendChild(modelContent);
	};
	
	function setArrowsTextContent(arrow, frame) {
		if(arrow !== null && arrow.date !== null && arrow.title !== null && frame !== null) {
			arrow.date.textContent = frame.getAttribute("title");
			arrow.title.textContent = frame.getAttribute("head-title");
		}
	};
	
	function moveToDayFrame() {
		let currentFrame = extmdl.data.getFrameById(currentFrameIndex + 1);
		let dayEventId = parseInt(currentFrame.getAttribute("data-id"))
		getHandleMovementToNextFrame(currentFrame);
		handleTopContainer(currentFrame, dayEventId);
		setArrowsTextContent(getNextArrow(), nextDayFrame());
		setArrowsTextContent(getPreviousArrow(), previousDayFrame());
	};
	
	function getMovedToNextFrame() {
		currentFrameIndex = getNextIndex(currentFrameIndex, extmdl.repository.count());
		moveToDayFrame();
	};
	
	function getMovedToPreviousFrame() {
		currentFrameIndex = getPreviousIndex(currentFrameIndex, extmdl.repository.count());
		moveToDayFrame();
	};
	
	function nextDayFrame() {
		let nextIndex = getNextIndex(currentFrameIndex, extmdl.repository.count());
		return extmdl.data.getFrameById(nextIndex + 1);
	};
	
	function previousDayFrame() {
		let previousIndex = getPreviousIndex(currentFrameIndex, extmdl.repository.count());
		return extmdl.data.getFrameById(previousIndex + 1);
	};
	
	function getNextIndex(index, count) {
		return (index + 1) % count;
	};
	
	function getPreviousIndex(index, count) {
		return (count + (index - 1)) % count;
	};
	
	function getPreviousArrowBound(x) {
		return parseFloat(extmdl.css.getPackedScreenArrowElements().previousHoverArrowClass().width) >= x;
	};
	
	function getNextArrowBound(x) {
		return (window.screen.width -
				parseFloat(extmdl.css.getPackedScreenArrowElements().nextHoverArrowClass().width)) <= x;
	};
	
	function getPreviousArrow() {
		return extmdl.data.previousArrowElements();
	};
	
	function getNextArrow() {
		return extmdl.data.nextArrowElements();
	};
	
	function getPermittedHeight() {
		return window.screen.height -
			parseFloat(extmdl.css.getStyleValueByElement(document.getElementById("bottom"), "height"));
	};
	
	function getHandleMouseOnWindow() {
		window.addEventListener("mousemove", mouseMovement, false);
		getMovedToNextFrame();
	};
	
	function mouseMovement(ev) {
		if(ev.clientY < getPermittedHeight()) {
			if(getPreviousArrowBound(ev.clientX)) {
				hasHoverPreviousArrow = true;
				extmdl.css.getMouseCursor("pointer");
				extmdl.css.setPreviousArrowOnHover(getPreviousArrow().arrow.classList);
				extmdl.css.setNormalText(getPreviousArrow().title.classList);
				extmdl.css.setNormalText(getPreviousArrow().date.classList, true);
				window.addEventListener("click", getMovedToPreviousFrame, false);
			} else if(hasHoverPreviousArrow) {
				hasHoverPreviousArrow = false;
				extmdl.css.getMouseCursor("default");
				extmdl.css.setPreviousArrowOnNormal(getPreviousArrow().arrow.classList);
				extmdl.css.setDescribeText(getPreviousArrow().title.classList);
				extmdl.css.setDescribeText(getPreviousArrow().date.classList, true);
				window.removeEventListener("click", getMovedToPreviousFrame, false);
			}
			
			if(getNextArrowBound(ev.clientX)) {
				hasHoverNextArrow = true;
				extmdl.css.getMouseCursor("pointer");
				extmdl.css.setNextArrowOnHover(getNextArrow().arrow.classList);
				extmdl.css.setNormalText(getNextArrow().title.classList);
				extmdl.css.setNormalText(getNextArrow().date.classList, true);
				window.addEventListener("click", getMovedToNextFrame, false);
			} else if(hasHoverNextArrow) {
				hasHoverNextArrow = false;
				extmdl.css.getMouseCursor("default");
				extmdl.css.setNextArrowOnNormal(getNextArrow().arrow.classList);
				extmdl.css.setDescribeText(getNextArrow().title.classList);
				extmdl.css.setDescribeText(getNextArrow().date.classList, true);
				window.removeEventListener("click", getMovedToNextFrame, false);
			}
		}
	};
	
	function getFramesHandler() {
		let allInnerEvents = document.querySelectorAll("#inner-event");
		addEventListenersOnMouseOverAndOut(allInnerEvents);
	};
	
	function removeFramesHandler() {
		let allInnerEvents = document.querySelectorAll("#inner-event");
		removeEventListenersOnMouseOverAndOut(allInnerEvents);
	};
	
	function addEventListenersOnMouseOverAndOut(allInnerEvents) {
		for(let i = 0; i < allInnerEvents.length; i++) {
			allInnerEvents[i].addEventListener("mouseover", innerEventsOnMouseOver, false);
			allInnerEvents[i].addEventListener("mouseout", innerEventsOnMouseOut, false);
		}
	};
	
	function removeEventListenersOnMouseOverAndOut(allInnerEvents) {
		for(let i = 0; i < allInnerEvents.length; i++) {
			allInnerEvents[i].removeEventListener("mouseover", innerEventsOnMouseOver, false);
			allInnerEvents[i].removeEventListener("mouseout", innerEventsOnMouseOut, false);
		}
	};
	
	function innerEventsOnMouseOver(ev) {
		let current = ev.currentTarget;
		let frameId = parseInt(current.getAttribute("data-id"));
		if((!hasHoveredFrame && hasStoppedChangeFrameAction() && !isOnThePreviousFrame(frameId)) ||
			(changeFrameMoveAction === null && !hasHoveredFrame)) {
			let currentZIndex = getFrameZIndex(current);
			lastSelectedFrame = (function() {
				return {
					frame: current,
					originId: frameId,
					originZIndex: currentZIndex
				}
			}());
			setOpenbox(current);
			current.style.zIndex = extmdl.timeLine.maxZIndex;
			hasHoveredFrame = true;
		}
	};
	
	function innerEventsOnMouseOut(ev) {
		let current = ev.currentTarget;
		let frameId = parseInt(current.getAttribute("data-id"));
		if((hasHoveredFrame && !isOnThePreviousFrame(frameId) && hasStoppedChangeFrameAction()) ||
			(changeFrameMoveAction === null && hasHoveredFrame)) {
			getBackToNormalStateLastFrame();
			hasHoveredFrame = false;
		}
	};
	
	function getBackToNormalStateLastFrame() {
		if(lastSelectedFrame !== null) {
			setClosebox(lastSelectedFrame.frame);
			lastSelectedFrame.frame.style.zIndex = lastSelectedFrame.originZIndex;
		}
	};
	
	function hasStoppedChangeFrameAction() {
		return changeFrameMoveAction !== null && changeFrameMoveAction.isStopped();
	};
	
	function isOnThePreviousFrame(frameId) {
		return previousFrame !== null && previousFrame.orginId === frameId;
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
	
	function listenFramesOnClick() {
		let events = document.querySelectorAll("#inner-event");
		for(let i = 0; i < events.length; i++) {
			events[i].addEventListener("click", function(ev) {
				if(extmdl.movement.canOpenBox(new Date()))
					handleTopContainerOnClick(ev);
			}, false);
		}
	};
	
	function listenTopContainerOnClick() {
		topContainer.addEventListener("click", onClickTopContainer, false);
	};
	
	function handleTopContainerOnClick(container) {
		if(containsImageCollection()) resetCurrentImageCollection();
		let current = container.currentTarget;
		let dayEventId = parseInt(current.getAttribute("data-id"));
		handleTopContainer(current, dayEventId);
	};
	
	function getHandleOfPreviousFrameId(dayEventId) {
		if(previousFrame !== null) {
			previousFrame.frame.style.zIndex = previousFrame.originZIndex;
			setClosebox(previousFrame.frame);
		}
		
		let current = extmdl.data.getFrameById(dayEventId);
		previousFrame = (function() {
			let thisFrameZIndex = getFrameZIndex(current);
			return {
				frame: current,
				orginId: dayEventId,
				originZIndex: thisFrameZIndex
			}
		}());
	};
	
	function getHandleMovementToNextFrame(currentFrame) {
		let lineOnLeft = extmdl.movement.lineLeftPosition();
		let frameLeft = getFrameLeft(currentFrame);
		let middleScreen = extmdl.movement.middleOfScreen();
		let isMoveOnLeft = lineOnLeft + frameLeft < middleScreen;
		let distance = isMoveOnLeft ? middleScreen - (lineOnLeft + frameLeft) : (lineOnLeft + frameLeft) - middleScreen;
		changeFrameMoveAction = moveToNewDestination(isMoveOnLeft, (isMoveOnLeft ? distance : -distance), lineOnLeft, 350);
		changeFrameMoveAction.start();
	};
	
	function getFrameLeft(frame) {
		return parseFloat(frame.style.left);
	};
	
	function getFrameZIndex(frame) {
		return parseInt(frame.style.zIndex);
	};
	
	function resetCurrentImageCollection() {
		if(changeImageAction !== null) onStopChangePictureAnimations();
		changeImageAction = null;
		currentImageIndex = 0;
		multipleImageCollection = null;
	};
	
	function onClickTopContainer(ev) {
		if(containsImageCollection()) {
			let currentTarget = ev.currentTarget;
			let isOnTheLeft = isClientXOnTheLeftSideOfTopContainer(ev.clientX);
			if(isOnTheLeft) changeToPrevious();
			else changeToNext();
		}
	};
	
	function changeToNext() {
		let nextIndex = currentImageIndex;
		currentImageIndex = getNextIndex(currentImageIndex, multipleImageCollection.length);
		changePicture(nextIndex);
	};
	
	function changeToPrevious() {
		let previousIndex = currentImageIndex;
		currentImageIndex = getPreviousIndex(currentImageIndex, multipleImageCollection.length);
		changePicture(previousIndex);
	};
	
	function changePicture(previousIndex) {
		changePictureAnimations(previousIndex);
		onStartChangePictureAnimations();
	};
	
	function changePictureAnimations(previousIndex) {
		let previousImageAnimation = new extmdl.animate.Animation({
			target: multipleImageCollection[previousIndex],
			duration: 550,
			properties: {
				opacity: {
					from: 1,
					to: 0
				},
				display: {
					from: "block",
					to: "none"
				}
			},
			easing: "easeInCirc"
		});
		let currentImageAnimation = new extmdl.animate.Animation({
			target: multipleImageCollection[currentImageIndex],
			duration: 250,
			properties: {
				opacity: {
					from: 0,
					to: 1
				},
				display: {
					from: "none",
					to: "block"
				}
			},
			easing: "easeOutCirc"
		});
		changeImageAction = (function() {
			return function() {
				let animatePrevious = previousImageAnimation.animate();
				let animateCurrent = currentImageAnimation.animate();
				return {
					start: function() {
						animateCurrent.start();
						animatePrevious.start();
					},
					stop: function() {
						animateCurrent.stop();
						animatePrevious.stop();
					}
				}
			};
		}()());
	};
	
	function onStartChangePictureAnimations() {
		changeImageAction.start();
	};
	
	function onStopChangePictureAnimations() {
		changeImageAction.stop();
	};
	
	function isClientXOnTheLeftSideOfTopContainer(x) {
		return x - getTopContainerLeftPadding() < getTopContainerWidth() / 2;
	};
	
	function getHandleOfMultipleImages(multipleImages) {
		multipleImageCollection = multipleImages;
		currentImageIndex = 0;
	};
	
	function containsImageCollection() {
		return multipleImageCollection !== null;
	};
	
	function getTopContainerLeftPadding() {
		return topContainer.offsetLeft;
	};
	
	function getTopContainerWidth() {
		return parseFloat(extmdl.css.getStyleValueByElement(topContainer, "width"));
	};
	
	function moveToNewDestination(isMoveOnLeft, newDestination, releasePosition, duration) {
		let toStart = extmdl.movement.distanceToStart();
		let toEnd = extmdl.movement.distanceToEnd();
		if(isMoveOnLeft && newDestination > toStart) newDestination = toStart;
		else if(!isMoveOnLeft && newDestination < toEnd) newDestination = toEnd;
		let newPosition = releasePosition + newDestination;
		let innerLineAnimation = new extmdl.animate.Animation({
			target: extmdl.movement.innerLine(),
			duration: duration,
			properties: {
				left: {
					from: releasePosition + "px",
					to: newPosition + "px"
				}
			},
			easing: "easeInCubic"
		});
		let yearsLineAnimation = new extmdl.animate.Animation({
			target: extmdl.movement.yearsLine(),
			duration: duration,
			properties: {
				left: {
					from: releasePosition + "px",
					to: newPosition + "px"
				}
			},
			easing: "easeInCubic"
		});
		let yearsLineBeforeAnimation = new extmdl.animate.Animation({
			target: extmdl.movement.yearsLineBefore(),
			duration: duration,
			properties: {
				left: {
					from: (-1 * releasePosition) + "px",
					to: (-1 * newPosition) + "px"
				}
			},
			easing: "easeInCubic"
		});
		let moveAction = (function() {
			return function() {
				let animateInnerLine = innerLineAnimation.animate();
				let animateYearsLine = yearsLineAnimation.animate();
				let animateYearsLineBefore = yearsLineBeforeAnimation.animate();
				return {
					start: function() {
						animateInnerLine.start();
						animateYearsLine.start();
						animateYearsLineBefore.start();
					},
					stop: function() {
						animateInnerLine.stop();
						animateYearsLine.stop();
						animateYearsLineBefore.stop();
					},
					isStopped: function() {
						return animateInnerLine.isStopped();
					}
				}
			};
		}()());
		return moveAction;
	};
	
	// (622, 6) => 37.32 or otherwise, 6% from 622 = 37.32
	function convertValueFromPercentage(value, percentage) {
		return value * (percentage / 100);
	};
	
	// (622, 311) => 0.5 or otherwise 311 from 622 = 50%
	function convertValueToPercentage(value, part) {
		return part / value;
	};
	
	return {
		initialize: initialize,
		handleTopContainer: handleTopContainer,
		listenFramesOnClick: listenFramesOnClick,
		getHandleMouseOnWindow: getHandleMouseOnWindow,
		getHandleOfMultipleImages: getHandleOfMultipleImages,
		convertValueToPercentage: convertValueToPercentage,
		convertValueFromPercentage: convertValueFromPercentage,
		moveToNewDestination: moveToNewDestination
	};
}());