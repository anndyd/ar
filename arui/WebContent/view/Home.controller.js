sap.ui.define([
	'jquery.sap.global', 
	"sap/sf/ar/ui/view/base/BaseController",
	"sap/sf/ar/ui/service/UserService", 
	'sap/ui/core/Fragment',
	'sap/m/MessageToast',
	'sap/m/Popover', 
	'sap/m/Button',
	'sap/ui/model/json/JSONModel'
    ], function(jQuery, BaseController, UserService, 
        		  Fragment, MessageToast, Popover, Button, JSONModel) {
  "use strict";
  var us = new UserService();
  return BaseController.extend("sap.sf.ar.ui.view.Home", {
	users : [],

    onInit : function() {
    	var proxied = util.sessionInfo.proxied ? util.sessionInfo.proxied : false;
    	if (util.sessionInfo.role === "1" || proxied) {
    		this.byId("navigationList").getItems().forEach(function (itm) {
    			itm.setVisible(true);
    		});
	    	var that = this;
	    	// attache tab keyup event
			this.byId("openMenu").attachBrowserEvent("tab keyup", function(oEvent){
				this._bKeyboard = oEvent.type == "keyup";
			}, this);
			// create menu only once
			if (!this._menu) {
				this._menu = sap.ui.xmlfragment("sap.sf.ar.ui.view.fragment.Menu", this);
				this.getView().addDependent(this._menu);
			}
			var param = {
				start: 0,
				max: 20
			}
			us.getUsers(param).done(function(data) {
				if (data) {
					data.forEach(function(itm) {
						that.users[itm.userName] = itm;
					});
				}
			});
	    	if (proxied) {
	    		this.getView().byId("idUserName").setText(
	    				this.getResourceBundle().getText("proxyAs") + ": " + util.sessionInfo.userFullName);
	    	} else {
		    	this.getView().byId("idUserName").setText("");
	    	}
	    	this.byId("openMenu").setVisible(true);
	    	this._menu.getItems()[0].setVisible(proxied);
	    	this._menu.getItems()[1].setStartsSection(proxied);
    	}
    },
    
	handlePressOpenMenu: function(evt) {
		var oButton = evt.getSource();
		var eDock = sap.ui.core.Popup.Dock;
		this._menu.open(this._bKeyboard, oButton, eDock.EndTop, eDock.EndBottom, oButton);
	},

	handleMenuItemPress: function(evt) {
		var i18n = this.getResourceBundle();
        oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var data = oStorage.get("proxyData");
		if (evt.getParameter("item").getMetadata().getName() == "sap.ui.unified.MenuTextFieldItem") {
			if (!data || !data.oldSessionInfo) {
				data = {};
				data.oldSessionInfo = jQuery.extend(true, {}, util.sessionInfo);
			}
			var un = evt.getParameter("item").getValue().toUpperCase();
			var user = this.users[un];
			if (user) {
				evt.getParameter("item").setValue("");
				util.sessionInfo.currentUser = user.userName;
				util.sessionInfo.role = user.role;
				util.sessionInfo.userFullName = user.fullName;
				util.sessionInfo.proxied = true;
				
				data.sessionInfo = jQuery.extend(true, {}, util.sessionInfo);
		        oStorage.put("proxyData", data);
		        
		        this.getView().byId("idUserName").setText(
	    				this.getResourceBundle().getText("proxyAs") + ": " + util.sessionInfo.userFullName);
			} else {
				MessageToast.show(i18n.getText("noThisUser"));
			}
		} else {
			if (data && data.oldSessionInfo) {
				util.sessionInfo = jQuery.extend(true, {}, data.oldSessionInfo);
			}
			oStorage.clear();
			this.getView().byId("idUserName").setText("");
			util.sessionInfo.proxied = false;
		}
		evt.getSource().getItems()[0].setVisible(util.sessionInfo.proxied);
		evt.getSource().getItems()[1].setStartsSection(util.sessionInfo.proxied);
		
	},

    onCollapseExapandPress : function(event) {
      var navigationList = this.getView().byId('navigationList');
      var expanded = !navigationList.getExpanded();

      navigationList.setExpanded(expanded);
    },
    onSelectItem : function(event) {
        var txt = event.getParameters().item.getKey();
        if (txt) {
    		this.getRouter().navTo(txt);
        }
    }
  });

/**
 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
 * 
 * @memberOf view.Home
 */
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Home
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Home
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Home
*/
//	onExit: function() {
//
//	}

});