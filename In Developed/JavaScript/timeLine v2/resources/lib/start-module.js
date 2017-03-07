(function() {
	function run() {
		extmdl.initial.renderYearAndEvents(extmdl.zoom.currentZoom());
		extmdl.handler.listenFramesOnClick();
		extmdl.zoom.initializeZoom();
		extmdl.movement.initializeMovement();
		extmdl.handler.getFramesHandler();
	};
	
	return {
		run: function(data) {
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