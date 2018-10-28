package com.sap.sf.ar.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.sap.sf.ar.dao.OncallAllowanceDao;
import com.sap.sf.ar.entity.OncallAllowance;

@SuppressWarnings("unchecked")
@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class OncallAllowanceService {
    private static final Logger LOGGER = Logger.getLogger(OncallAllowanceService.class);

    @Autowired
    private OncallAllowanceDao dao;

    public List<OncallAllowance> getAll() {
    	return dao.findAll();
    }
 
	public List<OncallAllowance> getByCostCenter(String costCenter, int status) {
		String sql = "select o.* from OncallAllowance o " 
				+"left join user u on o.inumber=u.username "
				+"where o.status=?2 and u.costCenter=?1";
		Query query = dao.createNativeQuery(sql, OncallAllowance.class)
					.setParameter(2, status)
					.setParameter(1, costCenter);
		return query.getResultList();
    }
 
	public List<OncallAllowance> getByManage(String userName) {
		String sql = "select o.* from OncallAllowance o " 
				+"left join user u on o.inumber=u.username "
				+"where o.status=2 and u.username=?1";
		Query query = dao.createNativeQuery(sql, OncallAllowance.class)
					.setParameter(1, userName);
		return query.getResultList();
    }
    
	public List<OncallAllowance> getByStatus(int status) {
        return dao.createQuery("select t from OncallAllowance t where t.status=?1", OncallAllowance.class)
                .setParameter(1, status).getResultList();
    }
  
	public List<OncallAllowance> getByUsernameAndStatus(String userName, int status) {
		String sql = "select o.* from OncallAllowance o " 
					+"left join user u on o.inumber=u.username "
					+"where o.status=?1 and u.username=?2";
		Query query = dao.createNativeQuery(sql, OncallAllowance.class)
					.setParameter(1, status)
					.setParameter(2, userName);
		return query.getResultList();
    }
  
    public void upsert(OncallAllowance type) {
    	dao.merge(type);
    }
    
    public void delete(Long id) {
    	dao.remove(id);
    }
}
