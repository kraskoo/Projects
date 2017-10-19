// Steps:
// var winst = {}
// winst["animate"] = {}
// extendOn('resources/lib/animate-module.js', 'animate', function (result) { winst["animate"] = result; });
(function(global, factory) {
	factory(global);
} (typeof window !== "undefined" ? window : this, function(context) {
	context.extendOn = function (scriptUrl, name, callback) {
		context.extmdl[name] = {};
		var xhttp = new XMLHttpRequest();
		xhttp.setRequestHeader("Content-Type", "text/javascript; charset=UTF8");
		function get (url) {
			return new Promise(function (resolve, reject) {
				xhttp.open("GET", url, true);
				xhttp.send();
				xhttp.addEventListener("readystatechange", function () {
					if (this.status === 200 && this.readyState === 4) {
						resolve(this.responseText);
					}
				});
				xhttp.addEventListener("error", function () {
					reject(Error(this.status));
				});
			});
		};
		
		get(scriptUrl).then(function (response) {
			var returnFunc = new Function("return " + response);
			var script = returnFunc();
			for (var prop in script) {
				if (script.hasOwnProperty(prop)) {
					context.extmdl[name][prop] = script[prop];
				}
			}
			
			callback(context.extmdl[name]);
		}).catch(function (err) {
			console.log(err);
		});
	};
}));