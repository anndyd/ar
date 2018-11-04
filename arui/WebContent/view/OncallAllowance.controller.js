sap.ui.define([ 'jquery.sap.global', "sap/sf/ar/ui/js/Formatter",
		"sap/sf/ar/ui/view/base/BaseController",
		"sap/sf/ar/ui/service/OncallAllowanceService", 
		"sap/sf/ar/ui/service/AllowanceTypeService", 
		"sap/sf/ar/ui/service/RejectReasonService", 
		"sap/m/MessageToast",
		'sap/m/MessageBox',
		'sap/ui/model/json/JSONModel' ], function(jQuery, Formatter,
		BaseController, OncallAllowanceService, AllowanceTypeService, RejectReasonService,
		ßMessageToast, MessageBox, JSONModel) {
	"use strict";
	var oas = new OncallAllowanceService();
	var ats = new AllowanceTypeService();
	var rs = new RejectReasonService();
	
	return BaseController.extend("sap.sf.ar.ui.view.OncallAllowance", {
		formFragments: {},
		
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
			this.showFormFragment("AllowanceDisplay");
		},
		
		prepareAssetModel : function() {
			var i18n = this.getResourceBundle();
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
					aTypes: ata,
					statuses: ["",
						i18n.getText("new"),
						i18n.getText("sentToManager"),
						i18n.getText("managerApproved"),
						i18n.getText("taApproved"),
						i18n.getText("paid"),
						"","","",
						i18n.getText("reject")
					],
					saved: true,
					edit: false
				});
				aModel.refresh();
				
			});
		},

		handleGenerate : function() {
			var i18n = this.getResourceBundle();
			var that = this;
			var aData = that.getView().getModel("assist").getData();
			if (!aData.dateFrom || aData.dateFrom === "") {
				MessageBox.alert(i18n.getText("noFromDateQ"), {
				    title: i18n.getText("noFromDateT")
				});
				return;
			}
			if (!aData.dateTo || aData.dateTo === "") {
				MessageBox.alert(i18n.getText("noToDateQ"), {
				    title: i18n.getText("noToDateT")
				});
				return;
			}
				
			var data = this.getView().getModel().getData();
			if (data && data.length>0) {
				MessageBox.confirm(i18n.getText("clearDataQ"), {
				    title: i18n.getText("clearDataT"), 
				    onClose: function(oAction) {
				    	if (oAction === MessageBox.Action.OK) {
				    		that.generateAllowance();
				    	}
				    }
				});
			} else {
				this.generateAllowance();
			}
		},
		
		generateAllowance : function() {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			var oModel = that.getView().getModel();
			var aData = that.getView().getModel("assist").getData();
			var types = aData.types;
			var data = [];
			var dd = aData.dateFrom;
			while (dd <= aData.dateTo) {
				var type = util.getAllowanceTypeByDate(types, dd);
				type.forEach(function(itm) {
					var item = {
						iNumber: util.sessionInfo.currentUser,
						empName: util.sessionInfo.userFullName,
						type: itm.id,
						customerSite: aData.customerSite,
						oncallDate: dd,
						startTime: util.oncallAllowances[itm.id].start,
						endTime: util.oncallAllowances[itm.id].end,
						oncallHours: util.oncallAllowances[itm.id].hours,
						allowance: util.oncallAllowances[itm.id].allowance,
						status: 1
					};
					that.saveData(item);
					data.push(item);
				});
				var ddd = new Date(dd);
				ddd.setDate(ddd.getDate()+1);
				dd = ddd.toISOString().substring(0, 10);
			}
			oModel.setData(data);
			oModel.refresh();
			
			sap.ui.core.BusyIndicator.hide();
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
			var pData = evt.getParameters().listItem.getBindingContext().getProperty();
			rs.getByAid({aid: pData.id}).done(function(data) {
				pData.reason = data[0].reason;
				pModel.setData(pData);
				pModel.refresh();
				that.getView().byId("edit").setEnabled(true);
			});
		},
		
		handleDelete : function(evt) {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			var sPath = evt.getParameters().listItem.getBindingContext().getPath();
			var idx = sPath.match(/\d+/g)[0];
			
			var oId = that.getModel().getData()[idx].id;
			oas.deleteItem(oId).done(function (data){
				that.getModel().getData().splice(idx,1);
				that.getModel().refresh();
				MessageToast.show(that.getResourceBundle().getText(
				"deleteOncallAllowanceS"));
			});
		},

		handleCbChange : function(evt) {
			this.getAllowance();
		},

		handleInputChange : function(evt) {
			this.getAllowance();
		},

		handleAddPress : function() {
			this.toggleButtonsAndView(true);
			var that = this;
			var pModel = that.getView().getModel("input");
			pModel.setData({
				iNumber: util.sessionInfo.currentUser,
				empName: util.sessionInfo.userFullName,
				status: 1
			});
			pModel.refresh();
		},

		handleSavePress : function() {
			this.saveData(this.getView().getModel("input").getData());
			this.toggleButtonsAndView(false);
		},

		saveData : function(data, refresh) {
			var that = this;
			oas.upsert(data).done(
				function() {
					if (refresh) {
						that.refreshTable();
						that.toggleButtonsAndView(false);
						MessageToast.show(that.getResourceBundle().getText(
								"updateOncallAllowanceS"));
					}
				}
			);
		},

		handleSendPress : function() {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			var data = that.getView().getModel().getData();
			var param = {
				allowances: data,
				role: util.sessionInfo.role,
				sender: util.sessionInfo.userFullName,
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
		},
		
		handleEditPress : function (evt) {
			//Clone the data
			this.oSupplier = jQuery.extend({}, this.getView().getModel("input").getData());
			this.toggleButtonsAndView(true);
		},

		handleCancelPress : function () {
			//Restore the data
			var oModel = this.getView().getModel("input");
			oModel.setData(this.oSupplier);
			this.toggleButtonsAndView(false);
		},

		toggleButtonsAndView : function (bEdit) {
			var aModel = this.getView().getModel("assist");
			var data = aModel.getData();
			if (data.saved === bEdit) {
				data.edit = bEdit;
				data.saved =!bEdit;
				// Set the right form type
				this.showFormFragment(bEdit ? "AllowanceInput" : "AllowanceDisplay", bEdit);
			}
			aModel.setData(data);
			aModel.refresh();
//			var oView = this.getView();
//			if (oView.byId("edit").getVisible() === bEdit) {
//				// Show the appropriate action buttons
//				oView.byId("edit").setVisible(!bEdit);
//				oView.byId("save").setVisible(bEdit);
//				oView.byId("cancel").setVisible(bEdit);
//	
//			}
		},

		getFormFragment: function (sFragmentName) {
			var oFormFragment = this.formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "sap.sf.ar.ui.view.fragment." + sFragmentName);

			this.formFragments[sFragmentName] = oFormFragment;
			return this.formFragments[sFragmentName];
		},

		showFormFragment : function (sFragmentName, bEdit) {
			var oForm = this.byId("oncallAllowanceForm2");
			oForm.setEditable(bEdit);
			oForm.destroyContent();
			this.onExit();
			var oFragment = this.getFormFragment(sFragmentName);
			oFragment.forEach(function (itm) {
				oForm.addContent(itm);
			});
		},

		onExit : function () {
			for (var sPropertyName in this.formFragments) {
				if (!this.formFragments.hasOwnProperty(sPropertyName) || this.formFragments[sPropertyName] == null) {
					return;
				}

//				this.formFragments[sPropertyName].destroy();
				this.formFragments[sPropertyName] = null;
			}
		}

	});
});