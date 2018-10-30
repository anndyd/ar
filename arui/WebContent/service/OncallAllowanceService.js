sap.ui.define([
          'jquery.sap.global',
		  "sap/sf/ar/ui/service/BaseService"
          ], function(jQuery, BaseService) {
  "use strict";
  var bs = new BaseService();
  return BaseService.extend("sap.sf.ar.ui.service.OncallAllowanceService", {
    getAll: function(oData) {
      var dtd = $.Deferred();
      bs.asyncReq({
        url: "/ar/oncall/all",
        type: "GET",
       	contentType: "application/json"
      }).done(function(data) {
        dtd.resolve(data);
      }).fail(function(err) {
        dtd.reject(err);
      });
      return dtd.promise();
    },
	getByStatus: function(oData) {
	    var dtd = $.Deferred();
	    bs.asyncReq({
	      url: "/ar/oncall/allbystatus",
	      type: "GET",
	      contentType: "application/json",
	      data: oData
	    }).done(function(data) {
	      dtd.resolve(data);
	    }).fail(function(err) {
	      dtd.reject(err);
	    });
	    return dtd.promise();
	},
	getByNameAndStatus: function(oData) {
	    var dtd = $.Deferred();
	    bs.asyncReq({
	      url: "/ar/oncall/allbynameandstatus",
	      type: "GET",
	      contentType: "application/json",
	      data: oData
	    }).done(function(data) {
	      dtd.resolve(data);
	    }).fail(function(err) {
	      dtd.reject(err);
	    });
	    return dtd.promise();
	},
	getByRole: function(oData) {
	    var dtd = $.Deferred();
	    bs.asyncReq({
	      url: "/ar/oncall/allbyrole",
	      type: "GET",
	      contentType: "application/json",
	      data: oData
	    }).done(function(data) {
	      dtd.resolve(data);
	    }).fail(function(err) {
	      dtd.reject(err);
	    });
	    return dtd.promise();
	},
     update: function(oData) {
        var dtd = $.Deferred();
        bs.asyncReq({
          url: "/ar/oncall/update",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(oData)
        }).done(function(data) {
          dtd.resolve(data);
        });
        return dtd.promise();
	},
     upsert: function(oData) {
        var dtd = $.Deferred();
        bs.asyncReq({
          url: "/ar/oncall/upsert",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(oData)
        }).done(function(data) {
          dtd.resolve(data);
        });
        return dtd.promise();
     }
  
  });
 });
