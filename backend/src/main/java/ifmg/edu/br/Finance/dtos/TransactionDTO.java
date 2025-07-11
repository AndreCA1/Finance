package ifmg.edu.br.Finance.dtos;

import ifmg.edu.br.Finance.costants.PaymentStatus;
import ifmg.edu.br.Finance.costants.PaymentType;
import ifmg.edu.br.Finance.entities.Transaction;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class TransactionDTO {
    @Schema(description = "Database generated ID Month")
    @EqualsAndHashCode.Include
    private long id;
    @NotBlank(message = "Campo obrigatório")
    private Date date;

    @NotBlank(message = "Campo obrigatório")
    private String payee;
    @NotBlank(message = "Campo obrigatório")
    private PaymentType type;
    @NotBlank(message = "Campo obrigatório")
    private PaymentStatus status;
    @NotBlank(message = "Campo obrigatório")
    private Float amount;

    private Long userId;

    public TransactionDTO(Transaction novo) {
        id = novo.getId();
        date = novo.getDate();
        payee = novo.getPayee();
        type = novo.getType();
        status = novo.getStatus();
        amount = novo.getAmount();
        userId = novo.getUser().getId();
    }
}