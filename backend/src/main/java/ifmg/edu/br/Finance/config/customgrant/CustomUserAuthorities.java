package ifmg.edu.br.Finance.config.customgrant;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class CustomUserAuthorities {

	private String username;
	private Collection<? extends GrantedAuthority> authorities;
	private Long userId;

	//public CustomUserAuthorities(String username, Collection<? extends GrantedAuthority> authorities) {
	//	this.username = username;
	//	this.authorities = authorities;
	//}

	public CustomUserAuthorities(String username, Collection<? extends GrantedAuthority> authorities, Long userId) {
		this.username = username;
		this.authorities = authorities;
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public Long getId() {
		return userId;
	}
}
