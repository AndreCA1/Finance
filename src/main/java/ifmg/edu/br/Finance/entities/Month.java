package ifmg.edu.br.Finance.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

@Entity
@Table(name = "tb_month")
public class Month {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;

    private Float income;
    private Float totalSpent;
    private Float totalTransactions;
    private Float totalCashback;
    private Float totalInvestment;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
