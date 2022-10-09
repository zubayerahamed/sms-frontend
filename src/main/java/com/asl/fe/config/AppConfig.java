package com.asl.fe.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.Data;

/**
 * @author Zubayer Ahamed
 * @since Oct 8, 2022
 */
@Data
@Service
public class AppConfig {

	@Value("${api.baseUrl}")
	private String apiBaseUrl;
}
