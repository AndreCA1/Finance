package ifmg.edu.br.Finance.services;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.entities.Month;
import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.repository.MonthRepository;
import ifmg.edu.br.Finance.services.exceptions.DataBaseException;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Service
public class MonthService {
    @Autowired
    private MonthRepository monthRepository;

    @Transactional
    public MonthDTO insert(MonthDTO dto){
        Month entity = new Month();
        copyDtoToMonth(dto, entity);

        Month novo = monthRepository.save(entity);

        return new MonthDTO(novo);
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

    private void copyDtoToMonth(MonthDTO dto, Month entity){
        entity.setDate(dto.getDate());
        entity.setIncome(dto.getIncome());
        entity.setTotalCashback(dto.getTotalCashback());
        entity.setTotalInvestment(dto.getTotalInvestment());
        entity.setTotalSpent(dto.getTotalSpent());

        User user = new User();
        user.setId(dto.getUserId());
        entity.setUser(user);
    }
}
