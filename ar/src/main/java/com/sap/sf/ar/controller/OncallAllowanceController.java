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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sap.sf.ar.entity.OncallAllowance;
import com.sap.sf.ar.service.OncallAllowanceService;

@Controller
@RequestMapping("oncall")
@Scope("request")
public class OncallAllowanceController {
	private static final Logger LOGGER = Logger.getLogger(OncallAllowanceController.class);

	@Autowired
    private OncallAllowanceService service;

	@RequestMapping(value="/all", method = RequestMethod.GET)
	@ResponseBody
	@Transactional(readOnly = true)
	public List<OncallAllowance> getUsers(){
		List<OncallAllowance> types = service.getAll();
		return types;
	}
	
	@RequestMapping(value="/upsert", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void upsertUser(@RequestBody OncallAllowance type){
		service.upsert(type);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.DELETE)
	@ResponseBody
	@Transactional
	public void delete(@RequestParam Long id){
		service.delete(id);
	}

}

