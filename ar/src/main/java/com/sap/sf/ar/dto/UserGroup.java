package com.sap.sf.ar.dto;

import java.util.ArrayList;
import java.util.List;

public class UserGroup {
	private String key;
	private String text;
	private List<KeyPair> subGroups;


	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public List<KeyPair> getSubGroups() {
		if (subGroups == null) {
			subGroups = new ArrayList<>();
		}
		return subGroups;
	}

	public void setSubGroups(List<KeyPair> subGroups) {
		this.subGroups = subGroups;
	}
	
	
}
