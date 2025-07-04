package ifmg.edu.br.Finance.dtos;

import ifmg.edu.br.Finance.entities.Month;
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

public class MonthDTO {
    @Schema(description = "Database generated ID Month")
    @EqualsAndHashCode.Include
    private long id;
    @NotBlank(message = "Campo obrigatório")
    private Date date;

    @NotBlank(message = "Campo obrigatório")
    private Float income;
    private Float totalSpent;
    private Float totalTransactions;
    private Float totalCashback;
    private Float totalInvestment;

    private Long userId;

    public MonthDTO(Month novo) {
        id = novo.getId();
        date = novo.getDate();
        income = novo.getIncome();
        totalSpent = novo.getTotalSpent();
        totalTransactions = novo.getTotalTransactions();
        totalCashback = novo.getTotalCashback();
        totalInvestment = novo.getTotalInvestment();
        userId = novo.getUser().getId();
    }
}