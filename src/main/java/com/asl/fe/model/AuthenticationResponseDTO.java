package com.asl.fe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Zubayer Ahamed
 * @data Oct 14, 2022
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponseDTO {

	private String token;
}
