package ifmg.edu.br.Finance.repository;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.entities.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query(nativeQuery = true,
            value = """
                    SELECT
                        t.id,
                        t.date,
                        t.payee,
                        t.type,
                        t.status,
                        t.amount,
                        t.user_id
                    FROM tb_transaction t
                    WHERE MONTH(t.date) = MONTH(CURDATE())
                      AND YEAR(t.date) = YEAR(CURDATE())
                      AND t.user_id = :UserId
                    ORDER BY t.date;
                   """
    )
    Page<MonthDTO> searchTransactionsCurrentMonthByUserId(Long UserId, Pageable pageable);

    @Query(nativeQuery = true,
            value = """
                    SELECT
                        t.id,
                        t.date,
                        t.payee,
                        t.type,
                        t.status,
                        t.amount,
                        t.user_id
                    FROM tb_transaction t
                    WHERE MONTH(t.date) = :month 
                      AND YEAR(t.date) = YEAR(CURDATE())
                      AND t.user_id = :UserId
                    ORDER BY t.date;
                   """
    )
    Page<MonthDTO> searchTransactionsUsingSpecificMonth(Long UserId, Pageable pageable, int month);
}
