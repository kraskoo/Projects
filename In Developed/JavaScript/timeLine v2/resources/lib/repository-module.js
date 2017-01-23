let repository = (function() {
	const defaultYearPath = "resources/json/years/";
	
	let yearsCount = 0;
	let eventCount = 0;
	let count = 0;
	let id = 1;
	let daysById = {};
	
	function setDayData(value, day, dateObject) {
		if(value["source"].match(extmdl.string.outterLinkRegex) !== null) {
			day["type"] = "url";
			day["link"] = value["source"];
		} else if(value["source"].endsWith("xml")) {
			day["day"] = {};
			let url = value["source"];
			extmdl.parser.acceptXml(url, (xml) => {
				let xmlType = xml["type"];
				for(xmlElement in xml) {
					if(typeof(xml[xmlElement]) === "string") {
						day[xmlElement] = xml[xmlElement];
					} else {
						day["day"][xmlElement] = xml[xmlElement];
					}
				}
			});
			
		
			day["type"] = value["type"];
		}
		
		day["title"] = value["title"];
		day["id"] = id;
		day["date"] = dateObject;
		daysById[id++] = day;
		count++;
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
							eventCount += monthValue.length;
							for(let i = 0; i < monthValue.length; i++) {
								dayEvents[i] = {};
								setDayData(
									monthValue[i],
									dayEvents[i],
									extmdl.timeLine.getDateObject(day, month, year));
							}
						} else if(monthValue instanceof Object) {
							eventCount++;
							setDayData(
								monthValue,
								currentDay,
								extmdl.timeLine.getDateObject(day, month, year));
						}
					} else {
						if(!Object.keys(data[year]).includes("yearDays")) {
							eventCount++;
							data[year]["yearDays"] = extmdl.timeLine.getDaysOfYear(parseInt(year));
						}
					}
				}
			}
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
		getDayById: function(id) {
			return daysById[id];
		},
		checkDataFiles: function(outterDataCount) {
			return eventCount === count && outterDataCount === yearsCount;
		}
	}
}());