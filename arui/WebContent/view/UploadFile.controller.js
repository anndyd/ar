sap.ui.define(["sap/sf/ar/ui/view/base/BaseController",
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/core/mvc/Controller'],
	function(BaseController, MessageToast, MessageBox, Controller) {
	"use strict";

	return BaseController.extend("sap.ui.unified.sample.FileUploaderBasic.Controller", {
		onInit: function() {
	    },
	
		
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			sap.ui.core.BusyIndicator.hide();
			
			console.log(sResponse);
			if (sResponse && !isNaN(sResponse)) {
				var resTxt = "Import done, imported [ " + sResponse + " ] lines."
				MessageBox.alert(resTxt, {styleClass: "srMessageBoxStyle srMessageBoxAttention"});
			} else {
				var resTxt = "Import Excel data failed, reason: \n";
				MessageBox.alert(resTxt + sResponse, {styleClass: "srMessageBoxStyle srMessageBoxError"});
			}
		},
	
		handleUploadPmPress: function(oEvent) {
			sap.ui.core.BusyIndicator.show();
			var oFileUploader = this.byId("fileUploaderPm");
			oFileUploader.upload();
			oFileUploader.clear();
		},
	
		handleUploadSccmPress: function(oEvent) {
			sap.ui.core.BusyIndicator.show();
			var oFileUploader = this.byId("fileUploaderSccm");
			oFileUploader.upload();
			oFileUploader.clear();
		}
	});
});