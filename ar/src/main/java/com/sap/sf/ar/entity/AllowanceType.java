package com.sap.sf.ar.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class AllowanceType implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = -2174306365687464053L;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTimeType() {
		return timeType;
	}

	public void setTimeType(String timeType) {
		this.timeType = timeType;
	}

	public String getOncallSubsidyUnit() {
		return oncallSubsidyUnit;
	}

	public void setOncallSubsidyUnit(String oncallSubsidyUnit) {
		this.oncallSubsidyUnit = oncallSubsidyUnit;
	}

	public BigDecimal getOncallCustomerSiteYes() {
		return oncallCustomerSiteYes;
	}

	public void setOncallCustomerSiteYes(BigDecimal oncallCustomerSiteYes) {
		this.oncallCustomerSiteYes = oncallCustomerSiteYes;
	}

	public BigDecimal getOncallCustomerSiteNo() {
		return oncallCustomerSiteNo;
	}

	public void setOncallCustomerSiteNo(BigDecimal oncallCustomerSiteNo) {
		this.oncallCustomerSiteNo = oncallCustomerSiteNo;
	}

	public BigDecimal getOtPaymentMultiplier() {
		return otPaymentMultiplier;
	}

	public void setOtPaymentMultiplier(BigDecimal otPaymentMultiplier) {
		this.otPaymentMultiplier = otPaymentMultiplier;
	}

	public BigDecimal getOtPaymentBase() {
		return otPaymentBase;
	}

	public void setOtPaymentBase(BigDecimal otPaymentBase) {
		this.otPaymentBase = otPaymentBase;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String timeType;
    
    private String oncallSubsidyUnit;
    
    private BigDecimal oncallCustomerSiteYes;
    
    private BigDecimal oncallCustomerSiteNo;
    
    private BigDecimal otPaymentMultiplier;
    
    private BigDecimal otPaymentBase;
    
    private String memo;
    

}
