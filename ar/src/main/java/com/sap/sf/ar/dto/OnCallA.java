package com.sap.sf.ar.dto;

import java.math.BigDecimal;

public class OnCallA {
    private Long id;

    private String iNumber;

    private String empName;
    
    private Long type;
    
    private Boolean customerSite;
    
    private String oncallDate;
    
    private String startTime;
    
    private String endTime;
    
    private BigDecimal oncallHours;
    
    private BigDecimal allowance;
    
    private BigDecimal meal;
    
    private String remark;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getiNumber() {
		return iNumber;
	}

	public void setiNumber(String iNumber) {
		this.iNumber = iNumber;
	}

	public String getEmpName() {
		return empName;
	}

	public void setEmpName(String empName) {
		this.empName = empName;
	}

	public Long getType() {
		return type;
	}

	public void setType(Long type) {
		this.type = type;
	}

	public Boolean getCustomerSite() {
		return customerSite;
	}

	public void setCustomerSite(Boolean customerSite) {
		this.customerSite = customerSite;
	}

	public String getOncallDate() {
		return oncallDate;
	}

	public void setOncallDate(String oncallDate) {
		this.oncallDate = oncallDate;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public BigDecimal getOncallHours() {
		return oncallHours;
	}

	public void setOncallHours(BigDecimal oncallHours) {
		this.oncallHours = oncallHours;
	}

	public BigDecimal getAllowance() {
		return allowance;
	}

	public void setAllowance(BigDecimal allowance) {
		this.allowance = allowance;
	}

	public BigDecimal getMeal() {
		return meal;
	}

	public void setMeal(BigDecimal meal) {
		this.meal = meal;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}
