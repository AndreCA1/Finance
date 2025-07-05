package ifmg.edu.br.Finance.projections;

import java.util.Date;

public interface MonthDetailsProjection {
    Date getDate();
    Float getIncome();
    Float getTotalSpent();
    Float getTotalTransactions();
    Float getTotalCashback();
    Float getTotalInvestment();
    Long getUserId();
}
