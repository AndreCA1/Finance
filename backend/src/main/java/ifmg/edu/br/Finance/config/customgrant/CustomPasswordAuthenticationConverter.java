package ifmg.edu.br.Finance.config.customgrant;

import ifmg.edu.br.Finance.dtos.UserDTO;
import ifmg.edu.br.Finance.projections.UserDetailsProjection;
import ifmg.edu.br.Finance.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.annotations.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;

import java.util.*;

public class CustomPasswordAuthenticationConverter implements AuthenticationConverter {

	private final UserService userService;

	public CustomPasswordAuthenticationConverter(UserService userService) {
		this.userService = userService;
	}

	@Nullable
	@Override
	public Authentication convert(HttpServletRequest request) {

		String grantType = request.getParameter(OAuth2ParameterNames.GRANT_TYPE);
				
		if (!"password".equals(grantType)) {
			return null;
		}
		
		MultiValueMap<String, String> parameters = getParameters(request);
		
		// scope (OPTIONAL)
		String scope = parameters.getFirst(OAuth2ParameterNames.SCOPE);
		if (StringUtils.hasText(scope) &&
				parameters.get(OAuth2ParameterNames.SCOPE).size() != 1) {
			throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_REQUEST);
		}
		
		// username (REQUIRED)
		String username = parameters.getFirst(OAuth2ParameterNames.USERNAME);
		if (!StringUtils.hasText(username) ||
				parameters.get(OAuth2ParameterNames.USERNAME).size() != 1) {
			throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_REQUEST);
		}
		
		// password (REQUIRED)
		String password = parameters.getFirst(OAuth2ParameterNames.PASSWORD);
		if (!StringUtils.hasText(password) ||
				parameters.get(OAuth2ParameterNames.PASSWORD).size() != 1) {
			throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_REQUEST);
		}
				
		Set<String> requestedScopes = null;
		if (StringUtils.hasText(scope)) {
			requestedScopes = new HashSet<>(
					Arrays.asList(StringUtils.delimitedListToStringArray(scope, " ")));
		}
		
		Map<String, Object> additionalParameters = new HashMap<>();
		parameters.forEach((key, value) -> {
			if (!key.equals(OAuth2ParameterNames.GRANT_TYPE) &&
					!key.equals(OAuth2ParameterNames.SCOPE)) {
				additionalParameters.put(key, value.get(0));
			}
		});

		//get id do usuario
		UserDetailsProjection user = userService.searchUserAndRoleByEmail(username);

		Authentication clientPrincipal = SecurityContextHolder.getContext().getAuthentication();	
		return new CustomPasswordAuthenticationToken(clientPrincipal, requestedScopes, additionalParameters, user.getUserId());
	}

	private static MultiValueMap<String, String> getParameters(HttpServletRequest request) {
		
		Map<String, String[]> parameterMap = request.getParameterMap();
		MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>(parameterMap.size());
		parameterMap.forEach((key, values) -> {
			if (values.length > 0) {
				for (String value : values) {
					parameters.add(key, value);
				}
			}
		});
		return parameters;
	}
}
