package com.asl.fe.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

import com.asl.fe.interceptor.AccessAuthorizationInterceptor;

/**
 * @author Zubayer Ahamed
 * @since Jan 5, 2021
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	@Bean
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasenames(
				"classpath:/messages/messages",
				"classpath:/messages/messages-salesandinvoice"
		);
		messageSource.setDefaultEncoding("UTF-8");
		return messageSource;
	}

	@Bean
	public AccessAuthorizationInterceptor menuAccessInterceptor() {
		return new AccessAuthorizationInterceptor();
	}

	@Bean
	public LocaleChangeInterceptor localeChangeInterceptor() {
		LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
		lci.setParamName("lang");
		return lci;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(menuAccessInterceptor()).addPathPatterns(getMenuPaths());
		registry.addInterceptor(localeChangeInterceptor());
	}

	private String[] getMenuPaths() {
		List<String> paths = new ArrayList<>();
		//EnumSet.allOf(com.asl.enums.MenuProfile.class).forEach(mp -> {
			paths.add("/business");
			paths.add("/user");
			paths.add("/contact");
			paths.add("/group");
			paths.add("/single-sms");
			paths.add("/bulk-sms");
		//});
		return paths.toArray(new String[paths.size()]);
	}

}
