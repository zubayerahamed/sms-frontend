package com.asl.fe.interceptor;

import java.io.IOException;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import com.asl.fe.model.RequestContext;

/**
 * @author Zubayer Ahamed
 * @data Jun 24, 2023
 */
public class RestTemplateInterceptor implements ClientHttpRequestInterceptor {

	private String token = null;

	public RestTemplateInterceptor(String token) {
		this.token = token;
	}

	@Override
	public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
		request.getHeaders().add(RequestContext.REQUEST_HEADER_NAME, "Bearer " + token);
		return execution.execute(request, body);
	}

}
