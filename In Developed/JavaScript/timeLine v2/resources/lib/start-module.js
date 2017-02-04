(function() {
	function run() {
		extmdl.initial.renderYearAndEvents(extmdl.zoom.currentZoom());
		extmdl.zoom.initializeZoom();
	};
	
	return {
		run: function(data) {
			extmdl.initial.initialize(data);
			extmdl.zoom.initialize();
			run();
		}
	};
}());