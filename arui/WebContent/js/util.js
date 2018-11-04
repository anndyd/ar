var util = {
    isLogin: false,
    sessionInfo: {},
    nodataTimeout: 5000,

	timeDifference : function(time1, time2) {
		if (time1 && time2) {
			return ((new Date("1970-01-01 " + time2) - new Date("1970-01-01 " + time1)) / 36e5).toFixed(1);
		}
	},
	
	parseJsonByCtxPath : function(obj, cPath) {
		var v;
		if (obj && cPath) {
			var parr = cPath[0].split("/");
			var props = JSON.stringify(obj);
			for (var i=1; i<parr.length; i++) {
				var idx = isNaN(parr[i]) ? "'" + parr[i] + "'" : parr[i];
				props += "[" + idx + "]";
			}
			v = eval(props);
		}
		return v;
	},
	
	getAllowanceTypeByDate(types, dd) {
		var wTypes = [];
		var holidays = ["2018-01-01","2018-02-16","2018-02-17","2018-02-18","2018-04-05","2018-05-01","2018-06-18","2018-09-24","2018-10-01","2018-10-02","2018-10-03",
			"2019-01-01","2019-02-05","2019-02-06","2019-02-07","2019-04-05","2019-05-01","2019-06-07","2019-09-13","2019-10-01","2019-10-02","2019-10-03"];
		types.forEach(function(type){
			if (holidays.includes(dd)) {
				if (type.name.toLowerCase().includes("holiday")) {
					wTypes.push(type);
					return wTypes;
				}
			} else if ((new Date(dd)).getDay() == 6 || (new Date(dd)).getDay() == 0) {
				if (type.name.toLowerCase().includes("weekend")) {
					wTypes.push(type);
					return wTypes;
				}
			} else if (type.name.toLowerCase().includes("workday")) {
				wTypes.push(type);
			}
		});
		return wTypes;
	},
	
	oncallAllowances: [
		{},
		{},
		{},
		{},
		{start: "18:00", end: "0:00", hours:  6, allowance:  66}, // workday late
		{start: "0:00", end: "09:00", hours:  9, allowance: 198}, // workday night
		{start: "0:00", end: "23:59", hours: 24, allowance: 528}, // weekend
		{start: "0:00", end: "23:59", hours: 24, allowance: 792}, // holiday
	]

};
