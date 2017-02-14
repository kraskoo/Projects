(function() {
	'use strict';
	
	const oneDay = 24 * 60 * 60 * 1000;
	const maxZIndex = 100001;
	const months = [ "january", "february", "march",
				"april", "may", "june", "july",
				"august", "september", "octomber",
				"november", "december" ];
	
	return {
		months: months,
		oneDay: oneDay,
		maxZIndex: maxZIndex,
		getDayObject: function(title, source) {
			if(typeof(title) !== "string" || typeof(source) !== "string") {
				throw new TypeError("Instances of title and source must be string type.");
			}
			
			return { title: title, source: source };
		},
		getDateObject: function(day, month, year) {
			if(typeof(day) !== "string" || typeof(month) !== "string" || typeof(year) !== "string") {
				throw new TypeError("Instances of day, month and year must be string type.");
			}
			
			return { day: Number(day), month: month, year: Number(year) };
		},
		containsDotPosition: function(dates, position, frame) {
			return dates.length > 0 && parseInt(dates[dates.length - 1].style.left) === parseInt(frame.style.left);
		},
		getMonthAsNumber: function(month) {
			switch(month) {
				case "january" : return 1;
				case "february" : return 2;
				case "march" : return 3;
				case "april" : return 4;
				case "may" : return 5;
				case "june" : return 6;
				case "july" : return 7;
				case "august" : return 8;
				case "september" : return 9;
				case "octomber" : return 10;
				case "november" : return 11;
				case "december" : return 12;
				default: throw new Error("Invalid month value exception.");
			}
		},
		getMonthAsBGName: function(month) {
			switch(month) {
				case "january" : return "януари";
				case "february" : return "февруари";
				case "march" : return "март";
				case "april" : return "април";
				case "may" : return "май";
				case "june" : return "юни";
				case "july" : return "юли";
				case "august" : return "август";
				case "september" : return "септември";
				case "octomber" : return "октомври";
				case "november" : return "ноември";
				case "december" : return "декември";
				default: throw new Error("Invalid month cast value exception.");
			}
		},
		getDaysOfYear: function(year) {
			let firstDate = new Date(year, 1, 0);
			let secondDate = new Date(year, 12, 31);
			return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
		},
		getDaysOfMonth: function(year, month) {
			let monthStart = new Date(year, month, 1);
			let monthEnd = new Date(year, month + 1, 1);
			return Math.round((monthEnd - monthStart) / (oneDay));
		},
		getDateAsTimestampNextToMinute: function(date) {
			if(!(date instanceof Date)) {
				throw new Error("Instance of `date` must be Date type.");
			}
			
			let minutes = extmdl.string.fixNumberLength(date.getMinutes(), 2);
			let seconds = extmdl.string.fixNumberLength(date.getSeconds(), 2);
			let milliseconds = extmdl.string.fixNumberLength(date.getMilliseconds(), 3);
			return {
				minutes: function() {
					return minutes;
				},
				seconds: function() {
					return seconds;
				},
				milliseconds: function() {
					return milliseconds;
				},
				result: function() {
					return parseInt (minutes + seconds + milliseconds + "");
				}
			};
		}
	};
}());