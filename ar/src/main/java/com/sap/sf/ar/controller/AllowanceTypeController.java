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
import com.sap.sf.ar.service.AllowanceTypeService;

@Controller
@RequestMapping("atype")
@Scope("request")
public class AllowanceTypeController {
	private static final Logger LOGGER = Logger.getLogger(AllowanceTypeController.class);

	@Autowired
    private AllowanceTypeService service;

	@RequestMapping(value="/all", method = RequestMethod.GET)
	@ResponseBody
	@Transactional(readOnly = true)
	public List<AllowanceType> getUsers(){
		List<AllowanceType> types = service.getAll();
		return types;
	}
	
	@RequestMapping(value="/upsert", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void upsertUser(@RequestBody AllowanceType type){
		service.upsert(type);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void delete(@RequestBody Long id){
		service.delete(id);
	}

}

