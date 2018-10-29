sap.ui.define([
    'jquery.sap.global',
    "sap/sf/ar/ui/view/base/BaseController",
	"sap/sf/ar/ui/service/UserService", 
	"sap/sf/ar/ui/service/RejectReasonService", 
	"sap/sf/ar/ui/service/OncallAllowanceService", 
	"sap/m/MessageToast",
    'sap/ui/model/json/JSONModel'
  ], function(jQuery, BaseController, UserService, RejectReasonService, 
		  OncallAllowanceService, MessageToast, JSONModel) {
  "use strict";

  var us = new UserService();
  var rrs = new RejectReasonService();
  var oas = new OncallAllowanceService();
  return BaseController.extend("sap.sf.ar.ui.view.AllowanceMaster", {

    onInit : function (evt) {
        var oData = [{
            text: "Node1",
            nodes: [{
              text: "Node1-1"
            }]
          }, {
            text: "Node2",
            nodes: [{
              text: "Node2-1"
            }]
          }];
    	
        var i18n = this.getResourceBundle();
    	var role = util.sessionInfo.role;
    	var user = util.sessionInfo.currentUser;
    	this.prepareData(user);
    },
    
    prepareData : function(user) {
//    	var aStatus = 0;
//    	if (role === "2") {  // manager
//    		aStatus = 2;
//    	} else if (role === "3") {  // TA
//    		aStatus = 3;
//    	} else if (role === "4") {  // HR
//    		aStatus = 4;
//    	}
    	
//    	var data =
//            [{"key":"I063098","text":"Anndy Dong",
//            	"subGroups":[{"key":"I897123","text":"Test 2"},
//            		{"key":"I098732","text":"Test name1"}]
//            }];

    	
    	var that = this;
    	var param = {userName: user};
    	us.getUserGroup(param).done(function(data) {
	 		var oModel = new JSONModel(data);
			that.getView().setModel(oModel);
    	});
    },
    
	onSearch: function (oEvent) {
		var oTableSearchState = [],
			sQuery = oEvent.getParameter("query");

		if (sQuery && sQuery.length > 0) {
			oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
		}

		this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
	},
	
	onSelectionChange: function (evt) {
		var ss=evt;
		var value = util.parseJsonByCtxPath(this.getModel().getData(), evt.getSource().getSelectedContextPaths());
//		var productPath = oEvent.getSource().getBindingContext("products").getPath(),
//			product = productPath.split("/").slice(-1).pop(),
//			oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
//
		this.getRouter().navTo("managerdetail", {param: value.key});
	},
	
	handleAcceptPress : function (evt) {
		var oSource = evt;
	},
	
	handleAcceptAllPress : function (evt) {
		var oSource = evt;
	}
    
  });

});
