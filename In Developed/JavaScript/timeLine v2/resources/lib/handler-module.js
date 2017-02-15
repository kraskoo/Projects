(function() {
	let topContainer, currentImageIndex, multipleImageCollection, changeImageAction;
	function initialize() {
		topContainer = document.getElementById("top");
		resetCurrentImageCollection();
		innerInitializer();
	};
	
	function innerInitializer() {
		topContainer.addEventListener("click", onClickTopContainer, false);
	};
	
	function handleTopContainer(container) {
		if(containsImageCollection()) resetCurrentImageCollection();
		if(topContainer.childNodes.length > 0) topContainer.removeChild(topContainer.childNodes[0]);
		let current = container.currentTarget;
		let dayEventId = parseInt(current.getAttribute("data-id"));
		let model = extmdl.repository.getDayById(dayEventId);
		let modelContent = extmdl.data.getContainerByModel(model);
		let modelType = modelContent.getAttribute("model");
		topContainer.appendChild(modelContent);
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
		let previousIndex = currentImageIndex;
		currentImageIndex++;
		if(currentImageIndex === multipleImageCollection.length) currentImageIndex = 0;
		changePicture(previousIndex);
	};
	
	function changeToPrevious() {
		let previousIndex = currentImageIndex;
		currentImageIndex--;
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
	
	// (622, 6) => 37.32 or told otherwise, 6% from 622 = 37.32
	function convertValueFromPercentage(value, percentage) {
		return value * (percentage / 100);
	};
	
	// (622, 311) => 0.5 or told otherwise 311 from 622 = 50%
	function convertValueToPercentage(value, part) {
		return part / value;
	};
	
	return {
		initialize: initialize,
		handleTopContainer: handleTopContainer,
		getHandleOfMultipleImages: getHandleOfMultipleImages,
		convertValueToPercentage: convertValueToPercentage,
		convertValueFromPercentage: convertValueFromPercentage
	};
}());