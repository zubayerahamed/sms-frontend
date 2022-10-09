package com.asl.fe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Controller
@RequestMapping({"/", "/home"})
public class HomeController extends AbstractController{

	@GetMapping
	public String loadHomePage(@RequestParam(required = false) String token, Model model) {
		if(StringUtils.hasText(token)) {
			sessionManager.addToMap(JSON_TOKEN, token);
		}

		String tokenKey = (String) sessionManager.getFromMap(JSON_TOKEN);
		if(tokenKey == null || !StringUtils.hasText(tokenKey)) {
			return "redirect:/login";
		}
		if(StringUtils.hasText(token)) {
			return "redirect:/";
		}

		return "home";
	}
}
