(function() {
	function run() {
		extmdl.initial.renderYearAndEvents(extmdl.zoom.currentZoom());
		extmdl.zoom.initializeZoom();
		extmdl.movement.initializeMovement();
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