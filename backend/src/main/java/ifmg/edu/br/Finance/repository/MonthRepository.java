package ifmg.edu.br.Finance.repository;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.entities.Month;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthRepository extends JpaRepository<Month, Long> {
    @Query(nativeQuery = true,
            value = """
                    select  m.date,
                            m.income,
                            m.totalSpent,
                            m.totalTransactions,
                            m.totalCashback,
                            m.totalInvestment,
                            m.user_id as UserId
                    from 
                        tb_month m
                    where 
                        m.user_id = :UserId
                            AND m.date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 11 MONTH)
                    ORDER BY m.date;	
                   """
    )
    Page<MonthDTO> searchLast12MonthsByUserId(Long UserId, Pageable pageable);

    @Query(
            value = """
            SELECT
                m.id,
                m.date,
                m.income,
                m.totalSpent,
                m.totalTransactions,
                m.totalCashback,
                m.totalInvestment,
                m.user_id
            FROM tb_month m
            WHERE MONTH(m.date) = MONTH(CURDATE())
              AND m.user_id = :userId
            ORDER BY m.date
           """,
            nativeQuery = true
    )
    MonthDTO searchCurrentMonthReceipt(Long userId);
}
