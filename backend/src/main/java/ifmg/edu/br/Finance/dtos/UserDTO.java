package ifmg.edu.br.Finance.dtos;

import ifmg.edu.br.Finance.entities.Role;
import ifmg.edu.br.Finance.entities.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class UserDTO {
    @Schema(description = "Database generated ID User")
    @EqualsAndHashCode.Include
    private long id;
    @NotBlank(message = "Campo obrigatório")
    private String name;
    @NotBlank(message = "Campo obrigatório")
    private String email;
    @NotBlank(message = "Campo obrigatório")
    private Set<RoleDTO> roles;

    public UserDTO(User entity) {
        id = entity.getId();
        name = entity.getName();
        email = entity.getEmail();
        roles = new HashSet<>();
        if (entity.getRoles() != null) {
            entity.getRoles().forEach(role -> roles.add(new RoleDTO(role)));
        }
    }
}
