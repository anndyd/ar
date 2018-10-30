sap.ui.define([
    'jquery.sap.global',
    "sap/sf/ar/ui/view/base/BaseController",
	"sap/sf/ar/ui/service/OncallAllowanceService", 
	"sap/sf/ar/ui/service/AllowanceTypeService", 
	"sap/sf/ar/ui/js/Formatter",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Label',
	'sap/m/Text',
	'sap/m/TextArea',
	"sap/m/MessageToast",
    'sap/ui/model/json/JSONModel'
  ], function(jQuery, BaseController, OncallAllowanceService, AllowanceTypeService, 
		  Formatter, Button, Dialog, Label, Text, TextArea, 
		  MessageToast, JSONModel) {
  "use strict";
  var oas = new OncallAllowanceService();
  var ats = new AllowanceTypeService();
  var tableData;
  return BaseController.extend("sap.sf.ar.ui.view.AllowanceDetail", {
	refreshParam : {},
	allData : {},

    onInit : function (evt) {
		var that = this;
    	var i18n = this.getResourceBundle();
    	tableData =
    		[{id: "iNumber", key: "iNumber", type: "Identifier"},
			 {id: "empName", key: "empName", type: "Text"},
			 {id: "atype", key: "parts: ['assist>aTypes', 'type'], formatter: 'sap.sf.ar.ui.js.Formatter.getAllowanceType'", type: "Text"},
			 {id: "customerSite", key: "path: 'customerSite', formatter: 'sap.sf.ar.ui.js.Formatter.yesNo'", type: "Text"},
			 {id: "oncallDate", key: "oncallDate", type: "Text"},
			 {id: "startTime", key: "startTime", type: "Text"},
			 {id: "endTime", key: "endTime", type: "Text"},
			 {id: "oncallHours", key: "oncallHours", type: "Number"},
			 {id: "allowance", key: "allowance", type: "Number"},
			 {id: "remark", key: "remark", type: "Text"}];
		var oModel = new JSONModel();
		var pModel = new JSONModel();
		var aModel = new JSONModel();

		aModel.setData({
			aTypes: []
        });
		that.getView().setModel(oModel);
		that.getView().setModel(pModel, "input");
		that.getView().setModel(aModel, "assist");
		that.getView().bindElement("input>/");
		that.getView().bindElement("assist>/");
    	
		this.getRouter().getRoute("managerdetail").attachPatternMatched(that.onViewMatched, this);		
		that.prepareAssetModel();
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
				aTypes: ata
			});
			aModel.refresh();
		});
	},
	
    onViewMatched : function (evt) {
    	var that = this;
    	var key = evt.getParameter("arguments").key;
    	var type = evt.getParameter("arguments").type;
    	if (key && type) {
			sap.ui.core.BusyIndicator.show();
			var r = util.sessionInfo.role;
			var rr = r;
			if (type === "employee") {
				rr = "0";
			}
			that.refreshParam = {
				role: rr,
				key: key,
				status: Number(r)
			};
			that.refreshData();
    	}
    },
    
    refreshData : function() {
    	var that = this;
		var oModel = this.getView().getModel();
		oas.getByRole(this.refreshParam).done(function(data) {
			that.allData = data;
			var aa = [];
			var sa = [];
			
			if (data && data.length > 0) {
				var temp = data[0].iNumber;
				for (var i=0;i<data.length;i++) {
					var v = data[i];
					if (temp === v.iNumber) {
						sa.push(v);
					} else {
						aa.push(sa);
						sa = [];
						sa.push(v);
					}
				}
				aa.push(sa);
				that.createFragment(tableData, aa.length); 
			}
			
			oModel.setData(aa);
			oModel.refresh();
		});
    },
    
	handleAcceptPress : function (evt) {
		var data = this.getModel().getData()[evt.getParameter("id").match(/\d+/)[0]-1];
		this.popAcceptDialog(data, "accept", "acceptQuestion");
	},
    
	handleRejectPress : function (evt) {
		var data = this.getModel().getData()[evt.getParameter("id").match(/\d+/)[0]-1];
		this.popRejectDialog(data, "reject", "rejectQuestion");
	},
	
	handleAcceptAllPress : function (evt) {
		this.popAcceptDialog(this.allData, "acceptAll", "acceptAllQuestion");
	},
	
	handleRejectAllPress : function (evt) {
		this.popRejectDialog(this.allData, "rejectAll", "rejectAllQuestion");
	},
	
	popAcceptDialog : function(data, acceptT, acceptQ) {
		var i18n = this.getResourceBundle();
		var that = this;
		var dialog = new Dialog({
			title: i18n.getText(acceptT),
			type: 'Message',
			content: new Text({ text: i18n.getText(acceptQ) }),
			beginButton: new Button({
				text: i18n.getText(acceptT),
				press: function () {
					that.updateStatus(data, "accept", "");
					dialog.close();
				}
			}),
			endButton: new Button({
				text: i18n.getText("cancel"),
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
	},
	
	popRejectDialog : function(data, rejectT, rejectQ) {
		var i18n = this.getResourceBundle();
		var that = this;
		var dialog = new Dialog({
			title: i18n.getText(rejectT),
			type: 'Message',
			content: [
				new Label({ text: i18n.getText(rejectQ), labelFor: 'rejectDialogTextarea'}),
				new TextArea('rejectDialogTextarea', {
					width: '100%',
					placeholder: i18n.getText("rejectPlaceholder")
				})
			],
			beginButton: new Button({
				text: i18n.getText(rejectT),
				press: function () {
					var sText = sap.ui.getCore().byId('rejectDialogTextarea').getValue();
					that.updateStatus(data, "reject", sText);
					dialog.close();
				}
			}),
			endButton: new Button({
				text: i18n.getText("cancel"),
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
	},
	
	updateStatus : function (data, action, msg) {
		var that = this;
		var param = {
			entities: data,
			role: util.sessionInfo.role,
			action: action,
			msg: msg
		};
		oas.update(param).done(function(data) {
			if (data) {
				// success, refresh model
				that.refreshData();
			} else {
				// error
			}
//			MessageToast.show(that.getResourceBundle().getText(
//			"updateAllowanceS"));
		});
	},
	
	createFragment : function (tableData, num) {
		var oPage = this.getView().byId("aDetailPage");
		oPage.destroyContent();
				    
		for (var i=1; i<=num; i++) {
			var oTable = new sap.m.Table("idPrdList_"+i, {   
			      inset : false, 
			      backgroundDesign : "Solid",
			      growing : true,
			      growingScrollToLoad : true
			    });

			var colItems = new sap.m.ColumnListItem("colItems"+i, {type:"Active"});
		    oTable.bindAggregation("items","/"+(i-1),colItems);
			for (var j=0; j<tableData.length; j++) {
				var itm = tableData[j];
				this.addCol(itm.id, oTable);
				this.addColItem(itm.key, itm.type, colItems);
			}

			oPage.addContent(oTable);
			var oBtn1 = new sap.m.Button("accept"+i, {			
					text : "{i18n>accept}",
					type : "Accept"
				}).addStyleClass("sapUiSmallMarginEnd")
				.attachPress(this.handleAcceptPress, this);
			var oBtn2 = new sap.m.Button("reject"+i, {
					text : "{i18n>reject}",
					type : "Reject"
				}).addStyleClass("sapUiSmallMarginEnd")
				.attachPress(this.handleRejectPress, this);
			var oBar = new sap.m.Bar();
			oBar.addStyleClass("sapUiContentPadding");
			oBar.addContentRight(oBtn1);
			oBar.addContentRight(oBtn2);
			oPage.addContent(oBar);
		}
	},
	
	addCol : function(key, oTable) {
	    var col = new sap.m.Column({header: new sap.m.Label({text:"{i18n>" + key + "}"})});
	    oTable.addColumn(col);    
	},
	
	addColItem : function(key, type, colItems) {
	    var item;
		if (type === "Identifier") {
	    	item = new sap.m.ObjectIdentifier({text:"{" + key + "}"});
	    } else if (type === "Number") {
	    	item = new sap.m.ObjectNumber({number:"{" + key + "}"});
	    } else {
	    	item = new sap.m.Text({text:"{" + key + "}"});
	    }
	    colItems.addCell(item); 
	}
    
  });

});
