package com.sap.sf.ar.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.sap.sf.ar.entity.User;

@Repository
public class UserDao extends BaseDao<User> {
    public User findByName(String userName) {
    	User usr = new User();
        if (userName != null) {
            userName = userName.toUpperCase();
        }
        List<User> userList = em.createQuery("select t from User t where t.userName=?1", User.class)
                .setParameter(1, userName).setMaxResults(1).getResultList();
        return userList.isEmpty() ? usr : userList.get(0);
    }
}
