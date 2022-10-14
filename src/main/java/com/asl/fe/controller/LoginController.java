package com.asl.fe.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Controller
@RequestMapping("/login")
public class LoginController extends AbstractController{

	private static final String LOGAIN_PAGE_PATH = "login";
	private static final String OUTSIDE_USERS_NAME = "anonymousUser";

	@GetMapping
	public String loadLoginPage(Model model) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		if (OUTSIDE_USERS_NAME.equalsIgnoreCase(username)) {
			return LOGAIN_PAGE_PATH;
		}
		return "redirect:/";
	}
}
