sap.ui.define([
          'jquery.sap.global',
		  "sap/sf/ar/ui/service/BaseService"
          ], function(jQuery, BaseService) {
  "use strict";
  var bs = new BaseService();
  return BaseService.extend("sap.sf.ar.ui.service.UserService", {
    getSize: function() {
      var dtd = $.Deferred();
      bs.asyncReq({
        url: "/ar/user/getSize",
        type: "GET"
      }).done(function(data) {
        dtd.resolve(data);
      }).fail(function(err) {
        dtd.reject(err);
      });
      return dtd.promise();
    },
    getUserGroup: function(oData) {
      var dtd = $.Deferred();
      bs.asyncReq({
        url: "/ar/user/getusergroup",
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
    getUsers: function(oData) {
      var dtd = $.Deferred();
      bs.asyncReq({
        url: "/ar/user/all",
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
    getUser: function(oData) {
      var dtd = $.Deferred();
      bs.asyncReq({
        url: "/ar/user/get",
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
    upsertUser: function(oData) {
        var dtd = $.Deferred();
        bs.asyncReq({
          url: "/ar/user/upsert",
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
