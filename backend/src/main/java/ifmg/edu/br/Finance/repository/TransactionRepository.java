package ifmg.edu.br.Finance.repository;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.dtos.TransactionDTO;
import ifmg.edu.br.Finance.entities.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdAndDateBetween(Long userId, Date start, Date end);

    @Query(value = """
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
              AND t.user_id = :userId
            ORDER BY t.date
           """,
            countQuery = """
            SELECT COUNT(*)
            FROM tb_transaction t
            WHERE MONTH(t.date) = MONTH(CURDATE())
              AND YEAR(t.date) = YEAR(CURDATE())
              AND t.user_id = :userId
           """,
            nativeQuery = true
    )
    Page<TransactionDTO> searchTransactionsCurrentMonthByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query(
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
              AND t.user_id = :userId
            ORDER BY t.date
           """,
            countQuery = """
            SELECT COUNT(*)
            FROM tb_transaction t
            WHERE MONTH(t.date) = :month 
              AND YEAR(t.date) = YEAR(CURDATE())
              AND t.user_id = :userId
           """,
            nativeQuery = true
    )
    Page<TransactionDTO> searchTransactionsUsingSpecificMonth(Long userId, Pageable pageable, int month);
}
