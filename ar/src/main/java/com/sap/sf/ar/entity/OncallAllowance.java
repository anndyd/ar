package com.sap.sf.ar.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
public class OncallAllowance implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6989342215092160789L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String iNumber;

    private String empName;
    
    private Long type;
    
    private Boolean customerSite;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date oncallDate;
    
    private String startTime;
    
    private String endTime;
    
    private BigDecimal oncallHours;
    
    private BigDecimal allowance;
    
    private BigDecimal meal;
    
    private String remark;
    
    private Timestamp createdTime;

    /**
     * 1- new/need to modify, allow modify/delete
     * 2- sent to manager, read only
     * 3- manager approved, read only
     * 4- TA approve, read only
     * 5- paid, read only 
     * 9- rejected, allow modify/delete
     * 
     */
    private int status;
    
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

	public Date getOncallDate() {
		return oncallDate;
	}

	public void setOncallDate(Date oncallDate) {
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

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Timestamp getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}
    

}
