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
			var i18n = this.getResourceBundle();
			var that = this;
			
			var oModel = new JSONModel();
			var pModel = new JSONModel();
			var aModel = new JSONModel();
			pModel.setData({
				iNumber : util.sessionInfo.currentUser,
				empName : util.sessionInfo.userFullName
			});
			aModel.setData({
				types: [],
				statues: [
					i18n.getText("new"),
					i18n.getText("sentToManager"),
					i18n.getText("managerApproved"),
					i18n.getText("taApproved"),
					i18n.getText("paid"),
					i18n.getText("reject")
				]
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
						ata[v.id] = v;
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
			var dt = util.timeDifference(pData.startTime, pData.endTime);
			if (dt > 0) {
				pData.oncallHours = dt;
			} else {
				MessageToast.show(that.getResourceBundle().getText(
				"endTimeMustGreatThenStartTimeErr"));
			}
			
		},
			
		refreshTable : function() {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getView().getModel();
			var param = {
				iNumber: util.sessionInfo.currentUser,
				status: "1,9"
			};
			oas.getByiNumberAndStatus(param).done(function(data) {
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

		handleCbChange : function(evt) {
			this.getAllowance();
		},

		handleInputChange : function(evt) {
			this.getAllowance();
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
		},

		handleSendPress : function() {
			var that = this;
			var data = that.getView().getModel("input").getData();
			var param = {
				entities: data,
				role: util.sessionInfo.role,
				action: "accept",
				message: ""
			};
			oas.update(param).done(function(data) {
				that.refreshTable();
				MessageToast.show(that.getResourceBundle().getText(
						"sendToManagerS"));
			});
		},
		
		getAllowance : function() {
			var that = this;
			var pModel = that.getView().getModel("input");
			var pData = pModel.getData();
			var aModel = that.getView().getModel("assist");
			var aData = aModel.getData();
			var tAllowance = pData.customerSite ? 
					aData.aTypes[pData.type].oncallCustomerSiteYes : aData.aTypes[pData.type].oncallCustomerSiteNo;
			pData.allowance = tAllowance * pData.oncallHours;
			pModel.refresh();
		}
	});
});