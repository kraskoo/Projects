(function() {
	function run() {
		extmdl.initial.renderYearAndEvents(extmdl.zoom.currentZoom());
		extmdl.initial.setupChangePageArrows();
		extmdl.handler.listenFramesOnClick();
		extmdl.zoom.initializeZoom();
		extmdl.movement.initializeMovement();
		extmdl.handler.getHandleMouseOnWindow();
	};
	
	return {
		run: function(data) {
			extmdl.string.initialRepeat();
			extmdl.movement.initialize();
			extmdl.initial.initialize(data);
			extmdl.css.initializeScreenArrowsParts();
			extmdl.animate.initialize();
			extmdl.zoom.initialize();
			extmdl.handler.initialize();
			run();
		}
	};
}());