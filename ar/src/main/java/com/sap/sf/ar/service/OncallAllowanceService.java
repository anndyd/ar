package com.sap.sf.ar.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Query;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.sap.sf.ar.dao.OncallAllowanceDao;
import com.sap.sf.ar.dao.RejectReasonDao;
import com.sap.sf.ar.dto.ReviewRequest;
import com.sap.sf.ar.entity.OncallAllowance;
import com.sap.sf.ar.entity.RejectReason;

@SuppressWarnings("unchecked")
@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class OncallAllowanceService {
    private static final Logger LOGGER = Logger.getLogger(OncallAllowanceService.class);

    @Autowired
    private OncallAllowanceDao dao;

    @Autowired
    private RejectReasonDao rDao;

    public List<OncallAllowance> getAll() {
    	return dao.findAll();
    }
 
	public List<OncallAllowance> getByRole(String role, String key, int status) {
		String sql = "select o.* from OncallAllowance o " 
				+"left join user u on o.inumber=u.username "
				+"where o.status=?1";
		if ("2".equals(role)) {
			sql += " and u.manager=?2";
		} else if ("3".equals(role) || "4".equals(role)) {
			sql += " and u.costCenter=?2";
		} else {
			sql = "select o.* from OncallAllowance o " 
				 +"where o.status=?1 and o.inumber=?2";
		}
		sql += " order by o.iNumber,o.createdTime";
		Query query = dao.createNativeQuery(sql, OncallAllowance.class)
					.setParameter(1, status)
					.setParameter(2, key);
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
  
	public List<OncallAllowance> getByiNumberAndStatus(String iNumber, String status) {
		String sql = "select o.* from OncallAllowance o " 
					+"where o.status in (?1) and o.inumber=?2";
		Query query = dao.createNativeQuery(sql, OncallAllowance.class)
					.setParameter(1, status)
					.setParameter(2, iNumber);
		return query.getResultList();
    }
  
    public void upsert(OncallAllowance obj) {
    	dao.merge(obj);
    }
   
    public int update(ReviewRequest req) {
    	List<OncallAllowance> itms = req.getAllowances();
    	if (null == itms) {
    		return 0;
    	}
    	itms.forEach(itm->{
    		itm.setStatus("accept".equals(req.getAction()) ? itm.getStatus() + 1 : 9);
    		dao.merge(itm);
    		RejectReason rr = new RejectReason();
	    	if ("reject".equals(req.getAction())) {
	    		rr.setAllowanceId(itm.getId());
	    		rr.setiNumber(itm.getiNumber());
	    		rr.setReason(req.getMessage());
	    		rr.setCreateTime(Timestamp.valueOf(LocalDateTime.now()));
	    		rDao.merge(rr);
	    	}
    	});
    	
    	return 1;
    }
   
    public void delete(Long id) {
    	dao.remove(id);
    }
}
