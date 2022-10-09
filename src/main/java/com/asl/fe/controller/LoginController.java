package com.asl.fe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Controller
@RequestMapping("/login")
public class LoginController extends AbstractController{

	@GetMapping
	public String loadLoginPage(Model model) {
		String tokenKey = (String) sessionManager.getFromMap(JSON_TOKEN);
		if(tokenKey != null && StringUtils.hasText(tokenKey)) return "redirect:/";

		return "login";
	}
}
