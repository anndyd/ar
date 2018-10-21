package com.sap.sf.ar.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.sap.sf.ar.dao.OncallAllowanceDao;
import com.sap.sf.ar.entity.OncallAllowance;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class OncallAllowanceService {
    private static final Logger LOGGER = Logger.getLogger(OncallAllowanceService.class);

    @Autowired
    private OncallAllowanceDao dao;

    public List<OncallAllowance> getAll() {
    	return dao.findAll();
    }
    
    public void upsert(OncallAllowance type) {
    	dao.merge(type);
    }
    
    public void delete(Long id) {
    	dao.remove(id);
    }
}
