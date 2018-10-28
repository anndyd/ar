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
	}

};
