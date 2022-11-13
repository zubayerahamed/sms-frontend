package com.asl.fe.model;

import com.asl.fe.enums.BusinessType;

import lombok.Data;

/**
 * @author Zubayer Ahamed
 * @data Oct 14, 2022
 */
@Data
public class Business {

	private Long id;
	private BusinessType businessType;
	private String name;
	private String email;
	private String phone;
	private String mobile;
	private String address;
	private String city;
	private String country;
	private String currency;
	private String tinNo;
	private String websiteUrl;
	private String vatRegNo;
	private boolean active;
}
