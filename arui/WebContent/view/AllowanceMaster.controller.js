sap.ui.define([
    'jquery.sap.global',
    "sap/sf/ar/ui/view/base/BaseController",
	"sap/sf/ar/ui/service/UserService", 
	"sap/sf/ar/ui/service/RejectReasonService", 
	"sap/sf/ar/ui/service/OncallAllowanceService", 
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
    'sap/ui/model/json/JSONModel'
  ], function(jQuery, BaseController, UserService, RejectReasonService, 
		  OncallAllowanceService, Filter, Sorter, FilterOperator, 
		  MessageToast, JSONModel) {
  "use strict";

  var us = new UserService();
  var rrs = new RejectReasonService();
  var oas = new OncallAllowanceService();
  return BaseController.extend("sap.sf.ar.ui.view.AllowanceMaster", {

    onInit : function (evt) {
    	var role = util.sessionInfo.role;
    	var user = util.sessionInfo.currentUser;
		this.getRouter().getRoute("manager").attachPatternMatched(this.onViewMatched, this);		
    	this.prepareData(user);
    },
    
    prepareData : function(user) {
    	var that = this;
    	var param = {userName: user};
    	us.getUserGroup(param).done(function(data) {
	 		var oModel = new JSONModel(data);
			that.getView().setModel(oModel);
    	});
    },
    
    onViewMatched : function (evt) {
    	if (util.sessionInfo.proxied) {
    		this.getView().byId("idUserName").setText(
    				this.getResourceBundle().getText("proxyAs") + ": " + util.sessionInfo.userFullName);
    	} else {
	    	this.getView().byId("idUserName").setText("");
    	}
    },
    
	onSearch: function (oEvent) {
		var oTableSearchState = [],
			sQuery = oEvent.getParameter("query");

		if (sQuery && sQuery.length > 0) {
			oTableSearchState = [new Filter("text", FilterOperator.Contains, sQuery)];
		}

		this.byId("masterTree").getBinding("items").filter(oTableSearchState, "Application");
	},
	
	onSelectionChange: function (evt) {
		var value = util.parseJsonByCtxPath(this.getModel().getData(), evt.getSource().getSelectedContextPaths());
		this.getRouter().navTo("managerdetail", {key: value.key, type: value.type});
	}
    
  });

});
