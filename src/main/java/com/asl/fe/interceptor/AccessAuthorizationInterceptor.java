package com.asl.fe.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.AsyncHandlerInterceptor;

import com.asl.fe.service.ASLSessionManager;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Component
public class AccessAuthorizationInterceptor implements AsyncHandlerInterceptor {

	public static final String JSON_TOKEN = "JSON_TOKEN_KEY"; 

	@Autowired private ASLSessionManager sessionManager;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		String urlPath = request.getServletPath();
		if(urlPath.equalsIgnoreCase("/login")) return true;

		String tokenKey = (String) sessionManager.getFromMap(JSON_TOKEN);
		if(tokenKey == null || !StringUtils.hasText(tokenKey)) {
			response.sendRedirect("/login");
			return false;
		}

		return true;
	}
}
