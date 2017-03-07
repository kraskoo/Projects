(function() {
	let changeFrameMoveAction, changeImageAction, currentImageIndex, multipleImageCollection,
		previousFrame, lastSelectedFrame, hasHoveredFrame, selectionZIndex, topContainer;
		
	function initialize() {
		topContainer = document.getElementById("top");
		resetCurrentImageCollection();
		listenTopContainerOnClick();
		selectionZIndex = extmdl.timeLine.maxZIndex + 1;
		hasHoveredFrame = false;
		lastSelectedFrame = null;
		previousFrame = null;
		changeFrameMoveAction = null;
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
					handleTopContainer(ev);
			}, false);
		}
	};
	
	function listenTopContainerOnClick() {
		topContainer.addEventListener("click", onClickTopContainer, false);
	};
	
	function handleTopContainer(container) {
		if(containsImageCollection()) resetCurrentImageCollection();
		if(topContainer.childNodes.length > 0) topContainer.removeChild(topContainer.childNodes[0]);
		let current = container.currentTarget;
		let dayEventId = parseInt(current.getAttribute("data-id"));
		let currentFrame = extmdl.data.getFrameById(dayEventId);
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
	
	function getHandleOfPreviousFrameId(dayEventId) {
		if(previousFrame !== null) {
			previousFrame.frame.style.zIndex = previousFrame.originZIndex;
			setClosebox(previousFrame.frame);
		}
		
		let current = extmdl.data.getFrameById(dayEventId);
		previousFrame = (function() {
			let thisFrameZIndex = getFrameZIndex(current);
			let currentFrame = current;
			return {
				frame: currentFrame,
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
		if(changeImageAction !== undefined && changeImageAction !== null) {
			onStopChangePictureAnimations();
		}
		
		changeImageAction = null;
		currentImageIndex = -1;
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
		let nextIndex = currentImageIndex++;
		if(currentImageIndex === multipleImageCollection.length) currentImageIndex = 0;
		changePicture(nextIndex);
	};
	
	function changeToPrevious() {
		let previousIndex = currentImageIndex--;
		if(currentImageIndex === -1) currentImageIndex = multipleImageCollection.length - 1;
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
		getHandleOfMultipleImages: getHandleOfMultipleImages,
		getFramesHandler: getFramesHandler,
		convertValueToPercentage: convertValueToPercentage,
		convertValueFromPercentage: convertValueFromPercentage,
		moveToNewDestination: moveToNewDestination
	};
}());