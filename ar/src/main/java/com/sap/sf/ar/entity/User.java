package com.sap.sf.ar.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User implements Serializable {
    private static final long serialVersionUID = 185706989928100701L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String fullName;
    
    private boolean status;
    
    private String password;
    
    /**
     * 0- normal employee
     * 1- admin
     * 2- manager
     * 3- TA
     * 4- HR
     */
    private String role;
    
    private String manager;
    
    private String costCenter;
    
    /**
     * multiple cost center should be splitted with comma (,)
     */
    private String chargedCostCenter;
    
    private String remark;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
	    if (userName != null) {
	        userName = userName.toUpperCase();
        }
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public boolean getStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public String getCostCenter() {
		return costCenter;
	}

	public void setCostCenter(String costCenter) {
		this.costCenter = costCenter;
	}

	public String getChargedCostCenter() {
		return chargedCostCenter;
	}

	public void setChargedCostCenter(String chargedCostCenter) {
		this.chargedCostCenter = chargedCostCenter;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}
