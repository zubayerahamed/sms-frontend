package com.asl.fe.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.asl.fe.model.Response;
import com.asl.fe.model.TokenValidationReqDTO;
import com.asl.fe.model.TokenValidationResDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Slf4j
@Controller
@RequestMapping({"/", "/home"})
public class HomeController extends AbstractController{

	@SuppressWarnings({"unchecked" })
	@GetMapping
	public String loadHomePage(@RequestParam(required = false) String token, Model model) {
		if(StringUtils.hasText(token)) {

			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			TokenValidationReqDTO reqDto = new TokenValidationReqDTO();
			reqDto.setToken(token);
			ResponseEntity<String> response = restTemplate.postForEntity(appConfig.getApiBaseUrl() + "/authenticate/token/validate", reqDto, String.class);
			String responseBody = response.getBody();
			if(StringUtils.hasText(responseBody)) {
				ObjectMapper obm = new ObjectMapper();
				obm.setDateFormat(sdf);
				obm.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
				try {
					Response<TokenValidationResDTO> c = obm.readValue(responseBody, Response.class);
					if(c.isValid()) {
						sessionManager.addToMap(JSON_TOKEN, token);
					}
				} catch (JsonProcessingException e) {
					log.error("Error is : {}, {}", e.getMessage(), e);
				}
			}

		}

		String tokenKey = (String) sessionManager.getFromMap(JSON_TOKEN);
		if(tokenKey == null || !StringUtils.hasText(tokenKey)) {
			return "redirect:/login";
		}
		if(StringUtils.hasText(token)) {
			return "redirect:/";
		}

		return "pages/home/home";
	}
}
