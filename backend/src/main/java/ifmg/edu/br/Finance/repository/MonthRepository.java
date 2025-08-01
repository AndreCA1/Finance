package ifmg.edu.br.Finance.repository;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.entities.Month;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface MonthRepository extends JpaRepository<Month, Long> {

    @Query(nativeQuery = true,
            value = """
                SELECT m.id,
                	   m.date,
                	   m.income,
                	   m.total_spent,
                	   m.total_transactions,
                	   m.total_cashback,
                	   m.total_investment,
                	   m.user_id
                   FROM tb_month m
                   WHERE m.user_id = :userId AND DATE(m.date) = DATE(:date);
            """
    )
    Month monthByUserIdAndDate(Long userId, Date date);

    @Query(nativeQuery = true,
            value = """
                    select  
                    m.id,
                    m.date,
                    m.income,
                    m.total_spent,
                    m.total_transactions,
                    m.total_cashback,
                    m.total_investment,
                    m.user_id
                    from 
                        tb_month m
                    where 
                        m.user_id = :UserId
                        AND YEAR(m.date) = YEAR(CURDATE())
                    ORDER BY m.date;	
                   """
    )
    Page<MonthDTO> searchAllMonthsReceipt(Long UserId, Pageable pageable);

    @Query(
            value = """
            SELECT
                m.id,
                m.date,
                m.income,
                m.total_spent,
                m.total_transactions,
                m.total_cashback,
                m.total_investment,
                m.user_id
            FROM tb_month m
            WHERE MONTH(m.date) = MONTH(CURDATE())
              AND m.user_id = :userId
            ORDER BY m.date
           """,
            nativeQuery = true
    )
    MonthDTO searchCurrentMonthReceipt(Long userId);

    boolean existsByUser_Id(long userId);
}
