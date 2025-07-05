package ifmg.edu.br.Finance.projections;

import ifmg.edu.br.Finance.costants.PaymentType;
import ifmg.edu.br.Finance.costants.PaymentStatus;

import java.util.Date;

public interface TransactionDetailsProjection {
    Date getDate();
    String getPayee();
    PaymentType getType();
    PaymentStatus getStatus();
    Float getAmount();
    Long getUserId();
}
