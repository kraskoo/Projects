// Steps:
// var winst = {}
// winst["animate"] = {}
// extendOn('resources/lib/animate-module.js', winst["animate"]);
(function(global, factory) {
	factory(global);
} (typeof window !== "undefined" ? window : this, function(context) {
	const namePattern = new RegExp(/(let|var) (\w+)(\s|;)/gi);
	let countOfLoadedScripts = 0;
	function __innerSetter(response, instance, name) {
		// Resolved scope pollution :)
		(function() {
			let script = document.createElement("script");
			script.type = "text/javascript";
			script.textContent = response;
			let head = document.getElementsByTagName("head")[0];
			head.appendChild(script);
			console.log(name);
			let scrResult = new Function("return " + response + ";");
			let moduleInstance = {};
			moduleInstance = scrResult();
			for(method in moduleInstance) {
				instance[method] = moduleInstance[method];
			}
			
			head.removeChild(script);
			delete moduleInstance;
		}());
	};
	
	context.proceedLoading = function(statement, callback) {
		return function() {
				let interval = setInterval(function() {
				if (callback) {
					if(typeof(statement) === "function" && statement()) {
						clearInterval(interval);
						callback();
					} else if(statement) {
						clearInterval(interval);
						callback();
					}
				}
			}, 13);
		}();
	};
	
	context.countOfLoadedScripts = function() {
		return countOfLoadedScripts;
	};
	
	context.extendOn = function(url, instance, name, callback = __innerSetter) {
		let client = new XMLHttpRequest();
		client.addEventListener("readystatechange", function() {
			if(client.readyState === this.DONE && client.status === 200) {
				let response = client.response;
				callback(response, instance, name);
				countOfLoadedScripts++;
			}
		}, false);
		client.open("GET", url, true);
		client.send(null);
	};
}));