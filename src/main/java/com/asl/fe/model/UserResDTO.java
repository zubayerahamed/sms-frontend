package com.asl.fe.model;

import java.util.Date;

import lombok.Data;

/**
 * @author Zubayer Ahamed
 * @data Oct 14, 2022
 */
@Data
public class UserResDTO {

	private String fullName;
	private String username;
	private String email;
	private String address;
	private String phone;
	private String mobile;
	private boolean active;
	private boolean locked;
	private Date expiryDate;

	private boolean systemadmin;
	private boolean owner;
	private boolean reseller;
	private boolean customer;
	private boolean general;

	private String roles;
}
