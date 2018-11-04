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
import com.sap.sf.ar.dao.UserDao;
import com.sap.sf.ar.dto.MailContent;
import com.sap.sf.ar.dto.ReviewRequest;
import com.sap.sf.ar.entity.OncallAllowance;
import com.sap.sf.ar.entity.RejectReason;
import com.sap.sf.ar.entity.User;

@SuppressWarnings("unchecked")
@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class OncallAllowanceService {
    private static final Logger LOGGER = Logger.getLogger(OncallAllowanceService.class);

    @Autowired
    private OncallAllowanceDao dao;

    @Autowired
    private RejectReasonDao rDao;

    @Autowired
    private UserDao uDao;

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
					+"where o.status in (" + status + ") and o.inumber=?1";
		Query query = dao.createNativeQuery(sql, OncallAllowance.class)
					.setParameter(1, iNumber);
		return query.getResultList();
    }
  
    public void upsert(OncallAllowance obj) {
    	dao.merge(obj);
    }
   
    public int update(ReviewRequest req) {
    	List<OncallAllowance> itms = req.getAllowances();
    	if (null == itms || itms.size() < 1) {
    		return 0;
    	}
    	itms.forEach(itm->{
    		int st = itm.getStatus() == 9 ? 1 : itm.getStatus();
     		itm.setStatus("accept".equals(req.getAction()) ? st + 1 : 9);
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
    	sendNoteMail(req);
    	
    	return 1;
    }
   
    public void delete(Long id) {
    	dao.remove(id);
    }
    
    private void sendNoteMail(ReviewRequest req) {
    	MailContent info = new MailContent();
    	String fileName = "";
    	List<OncallAllowance> itms = req.getAllowances();
    	OncallAllowance itm = itms.get(0);
    	User user = uDao.findByName(itm.getiNumber());
    	if ("reject".equals(req.getAction())) {
    		// to employee
    		info.setReceiver(itm.getiNumber());
    		info.setApprover(req.getSender());
    		info.setReason(req.getMessage());
    		fileName = "rejected-request-template.html";
    	} else if (itm.getStatus() == 2) {
    		// to manager
    		info.setReceiver(user.getManager());
    		fileName = "approval-request-template.html";
    	}
    	
    	info.setLink("https://pekitwin2008vm.pek.sap.corp:1443/arui/#/oncall");
    	info.setItems(itms);
    	
    	SendMail sm = new SendMail();
    	sm.sendNoticeEmail(info, null, null, fileName);
    	
    }
}
