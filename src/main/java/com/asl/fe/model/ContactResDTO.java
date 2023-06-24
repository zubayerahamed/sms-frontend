package com.asl.fe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactResDTO {
	private String name;
	private String email;
	private String mobile;
	private boolean active;
}
