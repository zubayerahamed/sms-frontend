package com.asl.fe.service.impl;

import java.text.SimpleDateFormat;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.asl.fe.config.AppConfig;
import com.asl.fe.model.AuthenticationRequest;
import com.asl.fe.model.AuthenticationResponseDTO;
import com.asl.fe.model.Response;
import com.asl.fe.service.ASLSessionManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Zubayer Ahamed
 * @since Oct 13, 2022
 */
@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	private static final String JSON_TOKEN = "JSON_TOKEN_KEY"; 
	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

	@Autowired private AppConfig appConfig;
	@Autowired private ASLSessionManager sessionManager;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		if(StringUtils.isBlank(username)) {
			throw  new UsernameNotFoundException("Username required");
		}

		String[] token = username.split("\\|");
		if(token.length < 2) throw  new UsernameNotFoundException("User not found in the system");

		String xusername = token[0];
		String xpassword = token[1];

		AuthenticationRequest ar = new AuthenticationRequest();
		ar.setUsername(username);

		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		AuthenticationRequest reqDto = new AuthenticationRequest();
		reqDto.setUsername(xusername);
		reqDto.setPassword(xpassword);

		ResponseEntity<String> response = restTemplate.postForEntity(appConfig.getApiBaseUrl() + "/authenticate/token/", reqDto, String.class);
		String responseBody = response.getBody();
		if(StringUtils.isBlank(responseBody)) throw  new UsernameNotFoundException("User not found");

		ObjectMapper obm = new ObjectMapper();
		obm.setDateFormat(sdf);
		obm.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		try {
			@SuppressWarnings("unchecked")
			Response<AuthenticationResponseDTO> c = obm.readValue(responseBody, Response.class);
			sessionManager.addToMap(JSON_TOKEN, c.getObj().getToken());
		} catch (JsonProcessingException e) {
			log.error("Error is : {}, {}", e.getMessage(), e);
		}

		// extract all user details from token and make user details and session expiry
		
		return null;
	}

	
}
