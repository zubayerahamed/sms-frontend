package com.asl.fe.controller;

import java.text.SimpleDateFormat;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.asl.fe.config.AppConfig;
import com.asl.fe.model.Business;
import com.asl.fe.model.MyUserDetail;
import com.asl.fe.service.ASLSessionManager;
import com.asl.fe.service.ImportExportService;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Slf4j
public class AbstractController {

	public static final String JSON_TOKEN = "JSON_TOKEN_KEY"; 
	protected static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	protected static final String ERROR = "Error is {}, {}";
	protected static final String CONTENT_TYPE = "text/csv; application~/vnd.ms-excel~; charset=ISO-8859-1";
	protected static final String FILE_SUFFIX = "_data.csv";
	protected static final String UTF_CODE = "UTF-8";

	@Autowired protected ASLSessionManager sessionManager;
	@Autowired protected AppConfig appConfig;
	@Autowired protected ApplicationContext appContext;

	@ModelAttribute("apiBaseUrl")
	public String getApiBaseUrl() {
		return appConfig.getApiBaseUrl();
	}

	@ModelAttribute("jsonToken")
	public String getJsonToken() {
		return (String) sessionManager.getFromMap(JSON_TOKEN);
	}

	@ModelAttribute("business")
	protected Business loggedInBusiness() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(auth == null || !auth.isAuthenticated()) return null;

		Object principal = auth.getPrincipal();
		if(principal instanceof MyUserDetail) {
			MyUserDetail mud = (MyUserDetail) principal;
			return mud.getBusiness();
		}

		return null;
	}

	@ModelAttribute("loggedInUser")
	protected MyUserDetail loggedInUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(auth == null || !auth.isAuthenticated()) return null;

		Object principal = auth.getPrincipal();
		if(principal instanceof MyUserDetail) {
			MyUserDetail mud = (MyUserDetail) principal;
			return mud;
		}

		return null;
	}

	protected ImportExportService getImportExportService(String module) {
		if(StringUtils.isBlank(module)) return null;
		try {
			return (ImportExportService) appContext.getBean(module + "Service");
		} catch (Exception e) {
			log.error(ERROR, e.getMessage(), e);
			return null;
		}
	}
}
