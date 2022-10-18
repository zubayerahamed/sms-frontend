package com.asl.fe.enums;

/**
 * @author Zubayer Ahamed
 * @sincce Sep 13, 2022
 */
public enum UserRole {

	ROLE_SYSTEM_ADMIN("System Admin"), 
	ROLE_OWNER("Owner"), 
	ROLE_RESELLER("Reseller"), 
	ROLE_GENERAL("General"), 
	ROLE_CUSTOMER("Customer");

	private String des;

	private UserRole(String des) {
		this.des = des;
	}

	public String getDes() {
		return this.des;
	}
}
