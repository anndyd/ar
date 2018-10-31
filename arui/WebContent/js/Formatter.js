sap.ui.define([
       		"sap/ui/core/mvc/Controller"
    	], function(Controller) {
	"use strict";

	var Formatter = {
		userStatus :  function (fValue) {
			try {
//				var i18n = this.getResourceBundle();
				if (fValue) {
					return "Active";//i18n.getText("active");
				} else {
					return "Inactive";//i18n.getText("inactive");
				}
			} catch (err) {
				return "None";
			}
		},
		yesNo :  function (fValue) {
			try {
	//			var i18n = this.getResourceBundle();
				if (fValue) {
					return "Yes";//i18n.getText("active");
				} else {
					return "No";//i18n.getText("inactive");
				}
			} catch (err) {
				return "None";
			}
		},
		getStatus : function (types, type) {
			if (types && type) {
				return types[type];
			} else {
				return "";
			}
		},
		getAllowanceType : function (types, type) {
			if (types && type) {
				return types[type].name;
			} else {
				return "";
			}
			
		}
	};


	return Formatter;

}, /* bExport= */ true);
