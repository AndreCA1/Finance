package ifmg.edu.br.Finance.services;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.dtos.TransactionDTO;
import ifmg.edu.br.Finance.entities.Transaction;
import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.repository.TransactionRepository;
import ifmg.edu.br.Finance.services.exceptions.DataBaseException;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public TransactionDTO insert(TransactionDTO dto){
        Transaction entity = new Transaction();
        copyDtoToEntity(dto, entity);
        Transaction novo = transactionRepository.save(entity);
        return new TransactionDTO(novo);
    }

    @Transactional
    public TransactionDTO update(Long id, TransactionDTO dto){
        Transaction entity = transactionRepository.getReferenceById(id);
        copyDtoToEntity(dto, entity);
        entity = transactionRepository.save(entity);
        return new TransactionDTO(entity);
    }

    public void delete(Long id){
        if(!transactionRepository.existsById(id)) {
            throw new ResourceNotFound("Transaction not found: " + id);
        }
        try{
            transactionRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    public Page<MonthDTO> searchTransactionsCurrentMonth(Long id, Pageable pageable){
        if(!transactionRepository.existsById(id)) {
            throw new ResourceNotFound("Transaction not found: " + id);
        }
        try{
            return transactionRepository.searchTransactionsCurrentMonthByUserId(id, pageable);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    public Page<MonthDTO> searchTransactionsSpecificMonth(Long id, Pageable pageable, int month){
        if(!transactionRepository.existsById(id)) {
            throw new ResourceNotFound("Transaction not found: " + id);
        }
        try{
            return transactionRepository.searchTransactionsUsingSpecificMonth(id, pageable, month);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    private void copyDtoToEntity(TransactionDTO dto, Transaction entity){
        entity.setDate(dto.getDate());
        entity.setPayee(dto.getPayee());
        entity.setType(dto.getType());
        entity.setStatus(dto.getStatus());
        entity.setAmount(dto.getAmount());

        User userEntity = new User();
        userEntity.setId(dto.getUserId());
    }
}
