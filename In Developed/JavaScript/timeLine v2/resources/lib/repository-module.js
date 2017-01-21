let repository = (function() {
	const defaultYearPath = "resources/json/years/";
	
	let yearsCount = 0;
	let count = 0;
	
	function setDayData(value, day, worker) {
		if(!value["source"].endsWith("xml")) {
			day["url"] = value["source"];
		} else {
			day["day"] = {};
			let url = value["source"];
			extmdl.parser.acceptXml(url, (xml) => {
				for(xmlElement in xml) {
					day["day"][xmlElement] = xml[xmlElement];
				}
			});
		}
		
		day["title"] = value["title"];
	};
	
	function buildYear(json, data) {
		yearsCount = Object.keys(json).length;
		for(year in json) {
			let currentYear = json[year];
			for(month in currentYear) {
				data[year][month] = {};
				let currentMonth = currentYear[month];
				for(day in currentMonth) {
					let monthValue = currentMonth[day];
					let tryParseDay = parseInt(day);
					if(tryParseDay !== NaN && currentMonth[tryParseDay] !== undefined) {
						data[year][month][day] = {};
						let currentDay = data[year][month][day];
						if(monthValue instanceof Array) {
							let dayEvents = currentDay["day-events"] = [];
							for(let i = 0; i < monthValue.length; i++) {
								dayEvents[i] = {};
								setDayData(monthValue[i], dayEvents[i]);
							}
						} else if(monthValue instanceof Object) {
							setDayData(monthValue, currentDay);
						}
					}
				}
			}
			
			count++;
		}
	}
	
	return {
		setYearsData: function(years, data) {
			for(jsonYear in years) {
				data[jsonYear] = {};
				extmdl.parser.acceptJson(
					(defaultYearPath + years[jsonYear]),
					(json) => { buildYear(json, data) });
			}
		},
		checkDataFiles: function() {
			return yearsCount === count;
		}
	}
}());