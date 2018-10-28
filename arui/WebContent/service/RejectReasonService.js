sap.ui.define([
          'jquery.sap.global',
		  "sap/sf/ar/ui/service/BaseService"
          ], function(jQuery, BaseService) {
  "use strict";
  var bs = new BaseService();
  return BaseService.extend("sap.sf.ar.ui.service.RejectReasonService", {
    getAll: function(oData) {
      var dtd = $.Deferred();
      bs.asyncReq({
        url: "/ar/reason/all",
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
    upsert: function(oData) {
        var dtd = $.Deferred();
        bs.asyncReq({
          url: "/ar/reason/upsert",
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
