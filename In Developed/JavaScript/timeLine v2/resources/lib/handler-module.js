(function() {
	let changeImageAction, currentImageIndex, multipleImageCollection, topContainer;
	function initialize() {
		topContainer = document.getElementById("top");
		resetCurrentImageCollection();
		listenTopContainerOnClick();
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
		getHandleMovementToNextFrame(dayEventId);
		let model = extmdl.repository.getDayById(dayEventId);
		let modelContent = extmdl.data.getContainerByModel(model);
		topContainer.appendChild(modelContent);
	};
	
	function getHandleMovementToNextFrame(dayEventId) {
		let currentFrame = extmdl.data.getFrameById(dayEventId);
		let screenWidth = extmdl.movement.screenWidth();
		let frameLeft = getLeftOnFrame(currentFrame);
		let subtract = getSubtractionTimes(frameLeft, screenWidth);
		let currentLeftPosition = (frameLeft - (subtract * screenWidth));
		let middleScreen = extmdl.movement.middleOfScreen();
		let isMoveOnLeft = currentLeftPosition > middleScreen;
		let distance = currentLeftPosition - middleScreen;
		let moveAction = moveToNewDestination(isMoveOnLeft, distance, middleScreen, 1500);
		// moveAction.start();
	};
	
	function getSubtractionTimes(frameLeft, screenWidth) {
		let times = 0;
		do times++; while(screenWidth * times >= frameLeft);
		return times;
	};
	
	function getLeftOnFrame(frame) {
		return parseFloat(frame.style.left);
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
		convertValueToPercentage: convertValueToPercentage,
		convertValueFromPercentage: convertValueFromPercentage,
		moveToNewDestination: moveToNewDestination
	};
}());