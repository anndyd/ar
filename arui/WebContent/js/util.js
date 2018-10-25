var util = {
    isLogin: false,
    sessionInfo: {},
    nodataTimeout: 5000,

	timeDifference : function(time1, time2) {
		if (time1 && time2) {
			return ((new Date("1970-01-01 " + time2) - new Date("1970-01-01 " + time1)) / 36e5).toFixed(1);
		}
	}

};
