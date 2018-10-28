package com.sap.sf.ar.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sap.sf.ar.entity.AllowanceType;
import com.sap.sf.ar.entity.RejectReason;
import com.sap.sf.ar.service.RejectReasonService;

@Controller
@RequestMapping("reason")
@Scope("request")
public class RejectReasonController {
	private static final Logger LOGGER = Logger.getLogger(RejectReasonController.class);

	@Autowired
    private RejectReasonService service;

	@RequestMapping(value="/all", method = RequestMethod.GET)
	@ResponseBody
	@Transactional(readOnly = true)
	public List<RejectReason> getAll(){
		List<RejectReason> objs = service.getAll();
		return objs;
	}
	
	@RequestMapping(value="/upsert", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void upsert(@RequestBody RejectReason obj){
		service.upsert(obj);
	}

}

