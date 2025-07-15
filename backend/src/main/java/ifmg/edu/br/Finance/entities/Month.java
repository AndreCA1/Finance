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
    @Column(name = "total_cashback")
    private Float totalCashback;

    @Column(name = "total_spent")
    private Float totalSpent;

    @Column(name = "total_transactions")
    private Float totalTransactions;

    @Column(name = "total_investment")
    private Float totalInvestment;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
