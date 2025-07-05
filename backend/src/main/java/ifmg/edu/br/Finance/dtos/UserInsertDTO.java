package ifmg.edu.br.Finance.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInsertDTO extends UserDTO{

    @NotBlank(message = "Campo obrigatório")
    @Size(min = 2, max = 50)
    private String password;

}
