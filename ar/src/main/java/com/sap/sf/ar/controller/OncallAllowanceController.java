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

import com.sap.sf.ar.dto.ReviewRequest;
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
	public List<OncallAllowance> getAll(){
		List<OncallAllowance> objs = service.getAll();
		return objs;
	}

	@RequestMapping(value="/allbystatus", method = RequestMethod.GET)
	@ResponseBody
	@Transactional(readOnly = true)
	public List<OncallAllowance> getAll(@RequestParam int status){
		List<OncallAllowance> objs = service.getByStatus(status);
		return objs;
	}

	@RequestMapping(value="/allbyinumberandstatus", method = RequestMethod.GET)
	@ResponseBody
	@Transactional(readOnly = true)
	public List<OncallAllowance> findAll(@RequestParam String iNumber, @RequestParam String status){
		List<OncallAllowance> objs = service.getByiNumberAndStatus(iNumber, status);
		return objs;
	}

	@RequestMapping(value="/allbyrole", method = RequestMethod.GET)
	@ResponseBody
	@Transactional(readOnly = true)
	public List<OncallAllowance> getAllbyRole(@RequestParam String role, @RequestParam String key, 
			@RequestParam int status){
		List<OncallAllowance> objs = service.getByRole(role, key, status);
		return objs;
	}

	@RequestMapping(value="/allbymanager", method = RequestMethod.GET)
	@ResponseBody
	@Transactional(readOnly = true)
	public List<OncallAllowance> getAllbyManager(@RequestParam String iNumber){
		List<OncallAllowance> objs = service.getByManage(iNumber);
		return objs;
	}
	
	@RequestMapping(value="/upsert", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void upsert(@RequestBody OncallAllowance allowance){
		service.upsert(allowance);
	}
	
	@RequestMapping(value="/update", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void update(@RequestBody ReviewRequest req){
		service.update(req);
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.DELETE)
	@ResponseBody
	@Transactional
	public void delete(@RequestParam Long id){
		service.delete(id);
	}

}

