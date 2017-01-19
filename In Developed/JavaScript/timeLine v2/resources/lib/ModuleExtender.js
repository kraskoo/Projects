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
		// Unresolved scope pollution :(
		let script = document.createElement("script");
		script.type = "text/javascript";
		script.textContent = response;
		let head = document.getElementsByTagName("head")[0];
		head.appendChild(script);
		context[name] = eval(name);
		Object.assign(instance, context[name]);
		head.removeChild(script);
		delete context[name];
	};
	
	context.countOfLoadedScripts = countOfLoadedScripts;
	
	context.extendOn = function(url, instance, callback = __innerSetter) {
		let client = new XMLHttpRequest();
		client.open("GET", url, true);
		client.send();
		client.addEventListener("readystatechange", function() {
			if(client.readyState === this.DONE && client.status === 200) {
				let response = client.response;
				let matches = response.match(namePattern);
				if(matches === null) {
					throw new Error("The script you try to load must start with variable, which should exports the script functionality.");
				}
				
				response = response.replace(/\s+/g, " ");
				let name = matches[0];
				name = name.replace(/(var|let)/, "");
				name = name.replace(";", "");
				name = name.replace(/\s+/g, "");
				callback(response, instance, name);
				countOfLoadedScripts++;
			}
		}, false);
	};
}));