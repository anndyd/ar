sap.ui.define([
    'jquery.sap.global',
    "sap/sf/ar/ui/view/base/BaseController",
    'sap/ui/model/json/JSONModel'
  ], function(jQuery, BaseController, JSONModel) {
  "use strict";

  return BaseController.extend("sap.sf.ar.ui.view.AllowanceDetail", {

    onInit : function (evt) {
    	var tableData =
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
    	
    	var i18n = this.getResourceBundle();
		var oModel = new JSONModel();
		this.getView().setModel(oModel);
		this.createFragment(tableData, 2); 
    },
	
	handleAcceptPress : function (evt) {
		var oSource = evt;
	},
	
	handleAcceptAllPress : function (evt) {
		var oSource = evt;
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
		    oTable.bindAggregation("items","/value",colItems);
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
				.attachPress(this.handleAcceptPress);
			var oBtn2 = new sap.m.Button("reject"+i, {
					text : "{i18n>reject}",
					type : "Reject",
					press : "handlereRectPress"
				}).addStyleClass("sapUiSmallMarginEnd");
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
