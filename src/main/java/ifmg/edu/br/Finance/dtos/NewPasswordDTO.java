package ifmg.edu.br.Finance.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewPasswordDTO {
    @NotBlank(message = "Campo obrigatório")
    private String newPassword;
    @NotBlank(message = "Campo obrigatório")
    private String token;
}
