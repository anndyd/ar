package com.sap.sf.ar.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.sap.sf.ar.dao.RejectReasonDao;
import com.sap.sf.ar.entity.RejectReason;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class RejectReasonService {
    private static final Logger LOGGER = Logger.getLogger(RejectReasonService.class);

    @Autowired
    private RejectReasonDao dao;

    public List<RejectReason> getAll() {
    	return dao.findAll();
    }

    @SuppressWarnings("unchecked")
	public List<RejectReason> getByAllowanceId(Long aid) {
    	String sql = "select o.* from RejectReason o where o.allowanceId = ?1 order by o.id";
    	return dao.createNativeQuery(sql, RejectReason.class)
    			.setParameter(1, aid)
    			.getResultList();
    }
    
    public void upsert(RejectReason obj) {
    	dao.merge(obj);
    }
}
