package ifmg.edu.br.Finance.services;

import ifmg.edu.br.Finance.entities.Transaction;
import ifmg.edu.br.Finance.repository.TransactionRepository;
import ifmg.edu.br.Finance.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.util.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class MonthService {
    @Autowired
    private MonthRepository monthRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void generateMonthSummary(Date date, Long userId) {
        LocalDate localDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        LocalDate startLocal = localDate.withDayOfMonth(1);

        LocalDate endLocal = localDate.withDayOfMonth(localDate.lengthOfMonth());

        Date start = java.sql.Date.valueOf(startLocal);
        Date end = java.sql.Date.valueOf(endLocal);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(userId,start,end);

        float income = sumByType(transactions, "INCOME");
        float spent = sumByType(transactions, "SPENT");
        float cashback = sumByType(transactions, "CASHBACK");
        float investment = sumByType(transactions, "INVESTMENT");

        Month entity = new Month();
        Month month = monthRepository.monthByUserIdAndDate(userId, start);

        if(month != null){
            entity = monthRepository.getReferenceById(month.getId());
        }

        Optional<User> opt = userRepository.findById(userId);
        User user = opt.orElseThrow(() -> new ResourceNotFound("User not found"));

        entity.setUser(user);
        entity.setDate(start);

        entity.setIncome(income);
        entity.setTotalSpent(spent);
        entity.setTotalCashback(cashback);
        entity.setTotalInvestment(investment);
        entity.setTotalTransactions(income + spent + cashback + investment);

        monthRepository.save(entity);
    }

    private float sumByType(List<Transaction> transactions, String type) {
        return (float) transactions.stream()
                .filter(t -> type.equals(t.getType().toString()))
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    // Executa às 23:59 no último dia de cada mês
    @Scheduled(cron = "0 59 23 L * ?")
    @Transactional
    public void generateMonthlySummaries() {
        List<User> users = userRepository.findAll();
        Date today = new Date();

        for (User user : users) {
            generateMonthSummary(today, user.getId());
        }
    }

    @Transactional
    public MonthDTO searchCurrentMonthReceipt(Long id){
        try{
            return monthRepository.searchCurrentMonthReceipt(id);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    @Transactional
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
