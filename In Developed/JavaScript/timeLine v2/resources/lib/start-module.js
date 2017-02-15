(function() {
	function run() {
		extmdl.initial.renderYearAndEvents(extmdl.zoom.currentZoom());
		extmdl.zoom.initializeZoom();
		extmdl.movement.initializeMovement();
	};
	
	return {
		run: function(data) {
			extmdl.animate.initialize();
			extmdl.handler.initialize();
			extmdl.string.initialRepeat();
			extmdl.movement.initialize();
			extmdl.initial.initialize(data);
			extmdl.zoom.initialize();
			run();
		}
	};
}());