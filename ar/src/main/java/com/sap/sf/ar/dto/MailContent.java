package com.sap.sf.ar.dto;

import java.util.List;

import com.sap.sf.ar.entity.OncallAllowance;

public class MailContent {
	private String approver;
	private String receiver;
	private String link;
	private String reason;
	private String action;
	private List<OncallAllowance> items;
	
	public String getApprover() {
		return approver;
	}
	public void setApprover(String approver) {
		this.approver = approver;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public List<OncallAllowance> getItems() {
		return items;
	}
	public void setItems(List<OncallAllowance> items) {
		this.items = items;
	}
	
	
}
