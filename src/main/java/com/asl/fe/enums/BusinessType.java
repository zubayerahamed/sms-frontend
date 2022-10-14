package com.asl.fe.enums;

/**
 * @author Zubayer Ahamed
 * @sincce Sep 13, 2022
 */
public enum BusinessType {

	OWNER("Owner"), RESELLER("Reseller");

	private String des;

	private BusinessType(String des) {
		this.des = des;
	}

	public String getDes() {
		return this.des;
	}
}
