package com.sap.sf.ar.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.sap.sf.ar.dao.AllowanceTypeDao;
import com.sap.sf.ar.entity.AllowanceType;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class AllowanceTypeService {
    private static final Logger LOGGER = Logger.getLogger(AllowanceTypeService.class);

    @Autowired
    private AllowanceTypeDao dao;

    public List<AllowanceType> getAll() {
    	return dao.findAll();
    }
    
    public void upsert(AllowanceType type) {
    	dao.merge(type);
    }
    
    public void delete(Long id) {
    	dao.remove(id);
    }
}
