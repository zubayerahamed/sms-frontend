package com.asl.fe.model;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author Zubayer Ahamed
 * @data Oct 14, 2022
 */
@Data
@AllArgsConstructor
public class AuthenticationResponseDTO {

	private final String token;
}
