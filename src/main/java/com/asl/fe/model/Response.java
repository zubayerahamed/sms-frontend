package com.asl.fe.model;

import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * @author Zubayer Ahamed
 * @since Oct 10, 2022
 */
@Data
public class Response<R> {

	private boolean success = true;
	private boolean info = false;
	private boolean warning = false;
	private boolean valid = false;

	private String code;
	private String message;

	private Map<String, R> model;
	private List<R> items;
	private R obj;
}
