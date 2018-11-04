package com.sap.sf.ar.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.sap.sf.ar.dao.UserDao;
import com.sap.sf.ar.dto.KeyPair;
import com.sap.sf.ar.dto.UserGroup;
import com.sap.sf.ar.entity.User;
import com.sap.sf.ar.util.Utils;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class UserService {
    private static final Logger LOGGER = Logger.getLogger(UserService.class);

    @Autowired
    private UserDao dao;

    public void openSession() {
        User user = dao.findAll("id").get(0);
//        SessionHolder.setContext(user.getId(), getTenantLocale());
    }
    
	@SuppressWarnings("unchecked")
	public List<UserGroup> getManagedUserInfo(String userName) {
		List<UserGroup> ugs = new ArrayList<>();
		UserGroup ug = new UserGroup();
    	User usr = dao.findByName(userName);
    	String sql = "";
    	if (usr == null || !("2".equals(usr.getRole()) || "3".equals(usr.getRole()) || "4".equals(usr.getRole()))) {
    		return ugs;
    	}
    	
		if ("2".equals(usr.getRole())) { // manager
			sql = "select * from user t where t.manager = '" + userName + "' order by t.fullName";
		} else if ("3".equals(usr.getRole()) || "4".equals(usr.getRole())) { // TA/HR
			sql = "select t.* from user t where t.role = '2' and t.costCenter in ("
				 + Utils.getSqlInString(usr.getChargedCostCenter().split(","))
				 +") order by t.costCenter, t.manager";
		}
		Query query = dao.createNativeQuery(sql, User.class);
		List<User> usrs = query.getResultList();
		if (usrs != null) {
			for (int i=0; i<usrs.size(); i++) {
				User itm = usrs.get(i);
				List<KeyPair> sgs = ug.getSubGroups();
				if ("2".equals(usr.getRole()) && !StringUtils.equals(ug.getText(), usr.getFullName()) ) {
					ug = new UserGroup();
					sgs = ug.getSubGroups();
					ug.setKey(usr.getUserName());
					ug.setType("manager");
					ug.setText(usr.getFullName());
					
					ugs.add(ug);
				} else if (("3".equals(usr.getRole()) || "4".equals(usr.getRole()))
						&& !StringUtils.equals(ug.getText(), itm.getCostCenter()) ) {
					ug = new UserGroup();
					sgs = ug.getSubGroups();
					ug.setKey(itm.getCostCenter());
					ug.setType("costcenter");
					ug.setText(itm.getCostCenter());
					
					ugs.add(ug);
				}
				sgs.add(new KeyPair() {{
					setKey(itm.getUserName());
					setText(itm.getFullName());
					if ("2".equals(usr.getRole())) {
						setType("employee");
					} else {
						setType("manager");
					}
				}});
			}
		}
    	
    	return ugs;
    }

}
