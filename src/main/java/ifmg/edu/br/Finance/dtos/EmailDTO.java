package ifmg.edu.br.Finance.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class EmailDTO {
    @NotBlank
    @Email
    @EqualsAndHashCode.Include
    private String to;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;
}