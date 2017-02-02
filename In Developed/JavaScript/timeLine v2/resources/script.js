let extmdl = {};
(function(onRun) {
	// In my unpretentious view, this should called 'state machine' :)
	const settings = "resources/json/settings.json";
	const initialize = "resources/json/initialize.json";
	let pushedData = {};
	
	function initializing() {
		extmdl.parser.acceptJson(settings, (accepted) => { pushedData["settings"] = accepted; });
		extmdl.parser.acceptJson(initialize, (accepted) => { pushedData["initialize"] = accepted; });
		proceedOnLoad();
	};
	
	function checkLoadedFiles() {
		return Object.keys(pushedData).length === 2;
	};
	
	function checkData() {
		let data = pushedData["data"];
		for(year in data) {
			if(typeof(data[year]) !== "object") {
				return false;
			}
		}
		
		return extmdl
			.repository
			.checkDataFiles(() => { return Object.keys(pushed).length; });
	};
	
	function proceedOnLoad() {
		proceedLoading(checkLoadedFiles, onLoad);
	};
	
	function proceedOnRun() {
		proceedLoading(checkData, startup);
	};
	
	function onLoad() {
		pushedData["data"] = {};
		let pushed = pushedData["data"];
		let initializeYears = pushedData["initialize"];
		extmdl.repository.setYearsData(initializeYears, pushed);
		proceedOnRun();
	};
	
	function startup() {
		onRun(pushedData);
	};
	
	let moduleCount = 0;
	let moduleNames = [];

	function hasFullyLoadedModules() {
		for(module in extmdl) {
			if(Object.keys(extmdl[module]).length < 1) {
				return false;
			}
		}
		
		return countOfLoadedScripts() === moduleCount;
	};
	
	function extendModules(pathByNames) {
		moduleCount = Object.keys(pathByNames).length;
		for(module in pathByNames) {
			if(!moduleNames.includes(module)) {
				moduleNames.push(module);
				extmdl[module] = {};
				extendOn(pathByNames[module], extmdl[module], module);
			}
		}
	};
	
	function setupModules() {
		extendModules({
			'animate': 'resources/lib/animate-module.js',
			'css': 'resources/lib/css.extensions-module.js',
			'data': 'resources/lib/data.service-module.js',
			'parser': 'resources/lib/parser.js',
			'repository': 'resources/lib/repository-module.js',
			'start': 'resources/lib/start-module.js',
			'string': 'resources/lib/string.extensions-module.js',
			'timeLine': 'resources/lib/timeline-module.js'
		});
		
		proceedToInitialState();
	};
	
	function proceedToInitialState() {
		proceedLoading(hasFullyLoadedModules, initializing);
	};
	
	setupModules();
} ((data) => (() => extmdl.start.run(data))()));