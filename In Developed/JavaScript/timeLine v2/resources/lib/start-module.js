(function() {
	function run() {
		extmdl.initial.renderYearAndEvents(extmdl.zoom.currentZoom());
		extmdl.initial.setupChangePageArrows();
		extmdl.handler.listenFramesOnClick();
		extmdl.zoom.initializeZoom();
		extmdl.movement.initializeMovement();
		extmdl.handler.getFramesHandler();
		extmdl.handler.getHandleMouseOnWindow();
	};
	
	return {
		run: function(data) {
			extmdl.css.initializeScreenArrowsParts();
			extmdl.string.initialRepeat();
			extmdl.movement.initialize();
			extmdl.initial.initialize(data);
			extmdl.animate.initialize();
			extmdl.handler.initialize();
			extmdl.zoom.initialize();
			run();
		}
	};
}());