package ifmg.edu.br.Finance.services;

import ifmg.edu.br.Finance.entities.Transaction;
import ifmg.edu.br.Finance.repository.TransactionRepository;
import ifmg.edu.br.Finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.entities.Month;
import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.repository.MonthRepository;
import ifmg.edu.br.Finance.services.exceptions.DataBaseException;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import jakarta.transaction.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
public class MonthService {
    @Autowired
    private MonthRepository monthRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public void generateMonthlySummary() {
        System.out.println("\nExecutando agendador: " + LocalDateTime.now() + "\n");
        YearMonth currentMonth = YearMonth.now();
        YearMonth lastMonth = currentMonth.minusMonths(1);
        Date summaryDate = Date.valueOf(lastMonth.atDay(1));

        LocalDate start = lastMonth.atDay(1);
        LocalDate end = lastMonth.atEndOfMonth();

        List<User> users = userRepository.findAll();

        for (User user : users) {
            Long userId = user.getId();

            boolean alreadyExists = monthRepository.existsByUserIdAndDate(userId, summaryDate);
            if (alreadyExists) continue;

            List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                    userId,
                    java.sql.Date.valueOf(start),
                    java.sql.Date.valueOf(end)
            );

            if (transactions.isEmpty()) continue;

            float income = sumByType(transactions, "INCOME");
            float spent = sumByType(transactions, "SPENT");
            float cashback = sumByType(transactions, "CASHBACK");
            float investment = sumByType(transactions, "INVESTMENT");

            Month entity = new Month();

            entity.setUser(user);
            entity.setDate(summaryDate);

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
