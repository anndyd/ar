package com.sap.sf.ar.dto;

public class SessionInfo {
	private String role;
	private String currentUser;
	private String userFullName;
	private String userDisplayName;
	private String error;
	
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getCurrentUser() {
		return currentUser;
	}
	public void setCurrentUser(String currentUser) {
		this.currentUser = currentUser;
	}
	public String getUserFullName() {
		return userFullName;
	}
	public void setUserFullName(String userFullName) {
		this.userFullName = userFullName;
	}
	public String getUserDisplayName() {
		return userDisplayName;
	}
	public void setUserDisplayName(String userDisplayName) {
		this.userDisplayName = userDisplayName;
	}
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
 	
}
