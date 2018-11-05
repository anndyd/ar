sap.ui.define([ 'jquery.sap.global', "sap/sf/ar/ui/js/Formatter",
		"sap/sf/ar/ui/view/base/BaseController",
		"sap/sf/ar/ui/service/UserService", 
		"sap/m/MessageToast",
		'sap/ui/model/json/JSONModel' ], function(jQuery, Formatter,
		BaseController, UserService, MessageToast, JSONModel) {
	"use strict";
	var us = new UserService();
	var w, start = 0, count = 0, page = 0, PAGESIZE = 10, addMode = false;
	return BaseController.extend("sap.sf.ar.ui.view.User", {
		onInit : function(oEvent) {
			var that = this;
			var oModel = new JSONModel();
			var pModel = new JSONModel();
			pModel.setData({
				roleCtl : false
			});
			that.getView().setModel(oModel);
			that.getView().setModel(pModel, "input");
			that.getView().bindElement("input>/");
			us.getSize().done(function(data) {
				count = data;
			});
			that.refreshTable(0);
		},

		onTablePress : function(evt) {
			var that = this;
			var pModel = that.getView().getModel("input");
			var pData = evt.getParameters().listItem.getBindingContext().getProperty();
			
			pData.roleCtl = util.sessionInfo.role === "1";
			pData.editCtl = util.sessionInfo.role === "1" || util.sessionInfo.currentUser === itmCxt.getProperty("userName");
			pData.pwdCtl = util.sessionInfo.currentUser === itmCxt.getProperty("userName");
			pModel.setData(pData);
			pModel.refresh();

		},

		refreshTable : function(start) {
			sap.ui.core.BusyIndicator.show();
			var oModel = this.getView().getModel();
			var param = {
				start: start,
				max: PAGESIZE
			}
			us.getUsers(param).done(function(data) {
				oModel.setData(data);
				oModel.refresh();
			});
		},

		onExit : function() {
		},

		handleAddPress : function() {
			var that = this;
			var pModel = that.getView().getModel("input");
			pModel.setData({
				userName : "",
				fullName : "",
				status : 0,
				password : "",
				role : null,
				pwdCtl : false
			});
			pModel.refresh();
			addMode = true;
		},

		handleSavePress : function() {
			var that = this;
			us.upsertUser(that.getView().getModel("input").getData()).done(
				function() {
					if (addMode) {
						count++;
					}
					that.refreshTable(start);
					MessageToast.show(that.getResourceBundle().getText(
							"updateUserS"));
				}
			);
			addMode = false;
		},
		
		userStatus :  function (fValue) {
			try {
				var i18n = this.getResourceBundle();
				if (fValue) {
					return i18n.getText("active");
				} else {
					return i18n.getText("inactive");
				}
			} catch (err) {
				return "None";
			}
		},

		handleNext : function() {
			if (page < 0) {
				page = 1;
			} else {
				page += 1;
			}
			start = page * PAGESIZE;
			if ((start + PAGESIZE) >= count) {
				var Btn = this.getView().byId("btnNext");
				Btn.setEnabled(false);
			}
			if (start >= PAGESIZE) {
				var Btn = this.getView().byId("btnPrevious");
				Btn.setEnabled(true);
			}
			this.refreshTable(start);
		},

		handlePrevious : function() {
			page -= 1;
			if (page <= 0) {
				start = 0;
			} else {
				start = page * PAGESIZE;
			}
			if (start < count) {
				var Btn = this.getView().byId("btnNext");
				Btn.setEnabled(true);
			}
			if (start === 0) {
				var Btn = this.getView().byId("btnPrevious");
				Btn.setEnabled(false);
			}
			this.refreshTable(start);
		}
	});

});