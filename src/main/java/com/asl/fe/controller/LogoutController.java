package com.asl.fe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Controller
@RequestMapping("/logout")
public class LogoutController extends AbstractController{

	@GetMapping
	public String logout() {
		sessionManager.removeFromMap(JSON_TOKEN);
		return "redirect:/login";
	}
}
