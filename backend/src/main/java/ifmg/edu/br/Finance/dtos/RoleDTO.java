package ifmg.edu.br.Finance.dtos;

import ifmg.edu.br.Finance.entities.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RoleDTO {
    @EqualsAndHashCode.Include
    private long id;
    private String authority;

    public RoleDTO(Role role) {
        id = role.getId();
        authority = role.getAuthority();
    }
}