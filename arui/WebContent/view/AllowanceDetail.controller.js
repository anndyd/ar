sap.ui.define([
    'jquery.sap.global',
    "sap/sf/ar/ui/view/base/BaseController",
	"sap/sf/ar/ui/service/OncallAllowanceService", 
	"sap/sf/ar/ui/service/AllowanceTypeService", 
	"sap/m/MessageToast",
    'sap/ui/model/json/JSONModel'
  ], function(jQuery, BaseController, OncallAllowanceService, AllowanceTypeService, 
		  MessageToast, JSONModel) {
  "use strict";
  var oas = new OncallAllowanceService();
  var ats = new AllowanceTypeService();

  return BaseController.extend("sap.sf.ar.ui.view.AllowanceDetail", {

    onInit : function (evt) {
		var that = this;
    	var i18n = this.getResourceBundle();
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
    	
		that.createFragment(tableData, 2); 
		that.getRouter().getRoute("managerdetail").attachPatternMatched(that._onObjectMatched, that);		
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
    	var keyPair = evt.getParameter("arguments").keyPair;
		sap.ui.core.BusyIndicator.show();
		var oModel = this.getView().getModel();
		oas.getByRole().done(function(data) {
			oModel.setData(data);
			oModel.refresh();
		});
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
