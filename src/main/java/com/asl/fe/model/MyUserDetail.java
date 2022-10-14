package com.asl.fe.model;

import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.ToString;

/**
 * @author Zubayer Ahamed
 * @since Oct 13, 2022
 */
@ToString
public class MyUserDetail implements UserDetails {

	private static final long serialVersionUID = -2410479223343593445L;

	private String username;
	private String password;
	private String email;
	private boolean systemadmin;
	private boolean owner;
	private boolean reseller;
	private boolean customer;
	private String roles;
	private List<GrantedAuthority> authorities;
	private boolean enabled;
	private boolean locked;
	private Date expiryDate;

	public MyUserDetail(User user){
		this.username = user.getUsername();
		this.password = user.getPassword();
		this.email = user.getEmail();
		this.systemadmin = user.isSystemadmin();
		this.owner = user.isOwner();
		this.reseller = user.isReseller();
		this.customer = user.isCustomer();
		this.roles = user.getRoles();
		this.authorities = Arrays.stream(roles.split(","))
									.map(SimpleGrantedAuthority::new)
									.collect(Collectors.toList());
		this.enabled = user.isEnabled();
		this.locked = user.isLocked();
		this.expiryDate = user.getExpiryDate();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return this.password;
	}

	@Override
	public String getUsername() {
		return this.username;
	}

	public String getEmail() {
		return this.email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return new Date().before(this.expiryDate);
	}

	@Override
	public boolean isAccountNonLocked() {
		return !this.locked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return this.enabled;
	}

}
