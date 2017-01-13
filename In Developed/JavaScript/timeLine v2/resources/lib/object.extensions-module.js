(function(global, factory) {
	"use strict";
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = global.document ?
			factory(global, true) : function(w) {
				if (!w.document) {
					throw new Error("This extendeble object requires window document");
				}
				
				return factory(w);
			};
	} else {
		factory(global);
	}
})(typeof window !== "undefined" ? window : this, function(context) {
	"use strict";
	
	var stack = [];
	context.return = function() {
		
	};
	
	const jsonYearsPath = "../json/years/";
	
	function fetchFile(path, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					if (callback) callback(httpRequest);
				}
			}
		};
		
		httpRequest.open('GET', path);
		httpRequest.send();
	};
	
	context.acceptXmlData = function(data) {
		var parser = new DOMParser();
		var xml = parser.parseFromString(data.response, "application/xml");
		console.log(xml);
	};
	
	function extendJson(json, data) {
		for(data in json) data = json[data];
		return json;
	};
	
	var intializationPath = "resources/json/initialize.json";
	var yearsIntialization = [];
	
	function intializeYears(json) {
		var yearJson = [];
		for(yearKey in json) {
			var path = (jsonYearsPath + json[yearKey]);
			var year = fetchFile(path, context.acceptJsonData.call);
		}
	};
	
	context.acceptData = {
		// fetchFile("resources/json/settings.json", acceptData.callWithJson);
		callWithJson: function(data) {
			var json = JSON.parse(data.response);
			json = extendJson(json, data);
			
		},
		// fetchFile("pages/1940/april/april1st.xml", acceptData.callWithXml);
		callWithXml: function(data) {
			var parser = new DOMParser();
			var xml = parser.parseFromString(data.response, "application/xml");
			return xml;
		}
	};
	
	function getJsonObject(to, json) {
		to = json;
		return json;
	};
	
	context.fetchFile = function(path, callback) {
		fetchFile(path, callback);
	};
	
	function extend(a, b) {
		for(var i in b) {
			a[i] = b[i];
		}
	};

	context.oppa = function() {
		console.log("oppa");
	};
});

// (function() {
	// 'use strict';
	
	// function distanceBetween(a, b) {
		// var dx = a.x - b.x;
		// var	dy = a.y - b.y;
		// return Math.sqrt(dx*dx + dy*dy);
	// }
	
	// return {
		// toArray: toArray,
		// distanceBetween: distanceBetween,
		// extend: extend
	// };
// });