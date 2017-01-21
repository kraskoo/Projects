let repository = (function() {
	const defaultYearPath = "resources/json/years/";
	
	let yearsCount = 0;
	let count = 0;
	
	function setDayData(value, day, dateObject) {
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
		day["date"] = dateObject;
	};
	
	function buildYear(json, data) {
		yearsCount = Object.keys(json).length;
		for(year in json) {
			let currentYear = json[year];
			for(month in currentYear) {
				data[year][month] = {};
				let currentMonth = currentYear[month];
				for(day in currentMonth) {
					if(!Object.keys(data[year][month]).includes("days")) {
						data[year][month]["days"] = currentMonth["days"];
					}
					
					let monthValue = currentMonth[day];
					let tryParseDay = parseInt(day);
					if(tryParseDay !== NaN && currentMonth[tryParseDay] !== undefined) {
						data[year][month][day] = {};
						let currentDay = data[year][month][day];
						if(monthValue instanceof Array) {
							let dayEvents = currentDay["day-events"] = [];
							for(let i = 0; i < monthValue.length; i++) {
								dayEvents[i] = {};
								setDayData(
									monthValue[i],
									dayEvents[i],
									extmdl.timeLine.getDateObject(day, month, year));
							}
						} else if(monthValue instanceof Object) {
							setDayData(
								monthValue,
								currentDay,
								extmdl.timeLine.getDateObject(day, month, year));
						}
					} else {
						if(!Object.keys(data[year]).includes("yearDays")) {
							data[year]["yearDays"] = extmdl.timeLine.getDaysOfYear(parseInt(year));
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
			console.log(data);
		},
		checkDataFiles: function() {
			return yearsCount === count;
		}
	}
}());