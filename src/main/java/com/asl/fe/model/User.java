package com.asl.fe.model;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;

import com.asl.fe.enums.UserRole;

import lombok.Data;

/**
 * @author Zubayer Ahamed
 * @data Oct 14, 2022
 */
@Data
public class User {

	private String username;
	private String email;
	private String password;
	private boolean systemadmin;
	private boolean owner;
	private boolean reseller;
	private boolean customer;
	private String roles;
	private boolean enabled;
	private boolean locked;
	private Date expiryDate;

	public String getRoles() {
		this.roles = "";
		if(Boolean.TRUE.equals(systemadmin)) roles += UserRole.ROLE_SYSTEM_ADMIN.name() + ',';
		if(Boolean.TRUE.equals(owner)) roles += UserRole.ROLE_OWNER.name() + ',';
		if(Boolean.TRUE.equals(reseller)) roles += UserRole.ROLE_RESELLER.name() + ',';
		if(Boolean.TRUE.equals(customer)) roles += UserRole.ROLE_CUSTOMER.name() + ',';

		if(StringUtils.isBlank(roles)) return roles;

		int lastComma = roles.lastIndexOf(',');
		String finalString = roles.substring(0, lastComma);
		roles = finalString;
		return roles;
	}
}
