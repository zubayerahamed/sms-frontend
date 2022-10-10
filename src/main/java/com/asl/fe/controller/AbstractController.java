package com.asl.fe.controller;

import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.asl.fe.config.AppConfig;
import com.asl.fe.service.ASLSessionManager;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
public class AbstractController {

	public static final String JSON_TOKEN = "JSON_TOKEN_KEY"; 
	protected static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

	@Autowired protected ASLSessionManager sessionManager;
	@Autowired protected AppConfig appConfig;

	@ModelAttribute("apiBaseUrl")
	public String getApiBaseUrl() {
		return appConfig.getApiBaseUrl();
	}

	@ModelAttribute("jsonToken")
	public String getJsonToken() {
		return (String) sessionManager.getFromMap(JSON_TOKEN);
	}
}
