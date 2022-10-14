package com.asl.fe.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import com.asl.fe.service.ASLSessionManager;

/**
 * @author Zubayer Ahamed
 * @since Jan 12, 2021
 */
public class CustomLogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler implements LogoutSuccessHandler {

	public static final String JSON_TOKEN = "JSON_TOKEN_KEY"; 

	@Autowired ASLSessionManager sessionManager;

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		sessionManager.removeFromMap(JSON_TOKEN);
		super.onLogoutSuccess(request, response, authentication);
	}
}
