sap.ui.define([ 'jquery.sap.global', "sap/sf/ar/ui/js/Formatter",
		"sap/sf/ar/ui/view/base/BaseController",
		"sap/sf/ar/ui/service/OncallAllowanceService", 
		"sap/sf/ar/ui/service/AllowanceTypeService", 
		"sap/m/MessageToast",
		'sap/ui/model/json/JSONModel' ], function(jQuery, Formatter,
		BaseController, OncallAllowanceService, AllowanceTypeService, MessageToast, JSONModel) {
	"use strict";
	var oas = new OncallAllowanceService();
	var ats = new AllowanceTypeService();
	
	return BaseController.extend("sap.sf.ar.ui.view.OncallAllowance", {
		onInit : function(oEvent) {
			var that = this;
			var oModel = new JSONModel();
			var pModel = new JSONModel();
			var aModel = new JSONModel();
			pModel.setData({
				iNumber : util.sessionInfo.currentUser,
				empName : util.sessionInfo.userFullName
			});
			aModel.setData({
				types: []
	        });
			that.getView().setModel(oModel);
			that.getView().setModel(pModel, "input");
			that.getView().setModel(aModel, "assist");
			that.getView().bindElement("input>/");
			that.getView().bindElement("assist>/");
			that.prepareAssetModel();
			that.refreshTable();
		},
		
		prepareAssetModel : function() {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			var aModel = this.getView().getModel("assist");
			ats.getAll().done(function(data) {
				var ata = [];
				if (data && data.length > 0) {
					data.forEach(function(v) {
						ata[v.id] = v.name;
					});
				}
				aModel.setData({
					types: data,
					aTypes: ata
				});
				aModel.refresh();
				
			});
		},

		handleGenerate : function() {
			
		},
		
		handleTimeChange : function(evt) {
			var that = this;
			var pModel = that.getView().getModel("input");
			var pData = pModel.getData();
//			pData.oncallHours = pData.endTime - pData.startTime;
			
		},
			
		refreshTable : function() {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getView().getModel();
			oas.getAll().done(function(data) {
				oModel.setData(data);
				oModel.refresh();
			});
		},

		onTablePress : function(evt) {
			var that = this;
			var pModel = that.getView().getModel("input");
			var itmCxt = evt.getParameters().listItem.getBindingContext();
			pModel.setData(itmCxt.getProperty());
			pModel.refresh();
		},
		
		handleDelete : function(evt) {
			var sPath = evt.getParameters().listItem.getBindingContext().getPath();
			var idx = sPath.match(/\d+/g)[0];
			this.getModel().getData().splice(idx,1);
			this.getModel().refresh();
		},

		onExit : function() {
		},

		handleAddPress : function() {
			var that = this;
			var pModel = that.getView().getModel("input");
			pModel.setData({});
			pModel.refresh();
		},

		handleSavePress : function() {
			var that = this;
			oas.upsert(that.getView().getModel("input").getData()).done(
				function() {
					that.refreshTable();
					MessageToast.show(that.getResourceBundle().getText(
							"updateOncallAllowanceS"));
				}
			);
		}

	});
});