package ifmg.edu.br.Finance.dtos;

import ifmg.edu.br.Finance.costants.PaymentStatus;
import ifmg.edu.br.Finance.costants.PaymentType;
import ifmg.edu.br.Finance.entities.Transaction;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class TransactionDTO {
    @Schema(description = "Database generated ID Month")
    @EqualsAndHashCode.Include
    private long id;
    @NotNull(message = "Campo obrigatório")
    private Date date;

    @NotBlank(message = "Campo obrigatório")
    private String payee;
    @NotNull(message = "Campo obrigatório")
    @Enumerated(EnumType.STRING)
    private PaymentType type;
    @NotNull(message = "Campo obrigatório")
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    @NotNull(message = "Campo obrigatório")
    @Positive(message = "Deve ser positivo")
    private Float amount;

    @NotNull(message = "Campo obrigatório")
    @Positive(message = "Deve ser positivo")
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

    // Construtor que traduz a str do BD para as constantes
    public TransactionDTO(long id, Date date, String payee, String type, String status, Float amount, Long userId) {
        this.id = id;
        this.date = date;
        this.payee = payee;
        this.type = PaymentType.valueOf(type);
        this.status = PaymentStatus.valueOf(status);
        this.amount = amount;
        this.userId = userId;
    }
}