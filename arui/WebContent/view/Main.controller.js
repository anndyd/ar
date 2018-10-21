sap.ui.define([
    'jquery.sap.global',
    "sap/sf/ar/ui/view/base/BaseController",
    'sap/ui/model/json/JSONModel'
  ], function(jQuery, BaseController, JSONModel) {
  "use strict";

  return BaseController.extend("sap.sf.ar.ui.view.Main", {

    onInit : function (evt) {
    	var i18n = this.getResourceBundle();
		var tileData = [ 
// 			{
// 				"icon" : "manager-insight",
// 				"title" : i18n.getText("sccmreport"),
// 				"tileId" : "sccmreport",
//				"info" : i18n.getText("sccmreporttip")
// 			},
 			{
 				"icon" : "activity-items",
 				"title" : i18n.getText("oncallAllowance"),
 				"tileId" : "oncall",
				"info" : i18n.getText("oncallAllowancetip")
 			},
 			{
 				"icon" : "activity-individual",
 				"title" : i18n.getText("atype"),
 				"tileId" : "atype",
				"info" : i18n.getText("atypetip")
 			}
//		    {
//				"icon" : "upload",
//				"title" : i18n.getText("upload"),
//				"tileId" : "upload",
//				"info" : i18n.getText("uploadtip")
// 			}
        ];
		var oModel = new JSONModel();
		oModel.setData(tileData);
		this.getView().setModel(oModel);
    },
    
    onTilePress : function(evt){
    	var oData = this.getView().getModel().getData();
    	var tileIdx = evt.getSource().sId.slice(-1);
		if (oData && tileIdx && oData.length > 0 && tileIdx > -1) {
			this.getRouter().navTo(oData[tileIdx].tileId);
		}
    }
  });

});
