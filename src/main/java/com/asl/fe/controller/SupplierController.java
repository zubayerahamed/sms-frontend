package com.asl.fe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Controller
@RequestMapping("/supplier")
public class SupplierController extends AbstractController{

	@GetMapping
	public String loadBusinessPage(Model model) {

		return "pages/supplier/supplier";
	}
}
