package com.sap.sf.ar.dto;


import java.util.List;

import com.sap.sf.ar.entity.OncallAllowance;

public class ReviewRequest {
	private List<OncallAllowance> allowances;
	private String sender;
	private String role;
	private String action;
	private String message;
	public List<OncallAllowance> getAllowances() {
		return allowances;
	}
	public void setAllowances(List<OncallAllowance> allowances) {
		this.allowances = allowances;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	
}
