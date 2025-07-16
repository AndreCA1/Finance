package ifmg.edu.br.Finance.services;

import ifmg.edu.br.Finance.entities.Transaction;
import ifmg.edu.br.Finance.repository.TransactionRepository;
import ifmg.edu.br.Finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.entities.Month;
import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.repository.MonthRepository;
import ifmg.edu.br.Finance.services.exceptions.DataBaseException;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;

import java.util.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class MonthService {
    @Autowired
    private MonthRepository monthRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public void generateMonthlySummary(Date date) {
        LocalDate localDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        LocalDate startLocal = localDate.withDayOfMonth(1);

        LocalDate endLocal = localDate.withDayOfMonth(localDate.lengthOfMonth());

        Date start = java.sql.Date.valueOf(startLocal);
        Date end = java.sql.Date.valueOf(endLocal);

        List<User> users = userRepository.findAll();

        for (User user : users) {
            Long userId = user.getId();

            List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(userId,start,end);

            if (transactions.isEmpty()) continue;

            float income = sumByType(transactions, "INCOME");
            float spent = sumByType(transactions, "SPENT");
            float cashback = sumByType(transactions, "CASHBACK");
            float investment = sumByType(transactions, "INVESTMENT");

            Month entity = new Month();
            Month month = monthRepository.monthByUserIdAndDate(userId, start);

            if(monthRepository.existsById(month.getId())){
                entity = monthRepository.getReferenceById(month.getId());
            }

            entity.setUser(user);
            entity.setDate(start);

            entity.setIncome(income);
            entity.setTotalSpent(spent);
            entity.setTotalCashback(cashback);
            entity.setTotalInvestment(investment);
            entity.setTotalTransactions(income + spent + cashback + investment);

            monthRepository.save(entity);
        }
    }

    private float sumByType(List<Transaction> transactions, String type) {
        return (float) transactions.stream()
                .filter(t -> type.equals(t.getType().toString()))
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    public MonthDTO searchCurrentMonthReceipt(Long id){
        if(!monthRepository.existsById(id)) {
            throw new ResourceNotFound("Transaction not found: " + id);
        }
        try{
            return monthRepository.searchCurrentMonthReceipt(id);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    public Page<MonthDTO> searchAllMonthReceipt(Long id, Pageable pageable){
        if(!monthRepository.existsById(id)) {
            throw new ResourceNotFound("Transaction not found: " + id);
        }
        try{
            return monthRepository.searchAllMonthsReceipt(id, pageable);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }
}
