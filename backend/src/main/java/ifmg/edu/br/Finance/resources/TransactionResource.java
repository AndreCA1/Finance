package ifmg.edu.br.Finance.resources;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.dtos.TransactionDTO;
import ifmg.edu.br.Finance.dtos.UserDTO;
import ifmg.edu.br.Finance.dtos.UserInsertDTO;
import ifmg.edu.br.Finance.services.TransactionService;
import ifmg.edu.br.Finance.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;


@RestController
@RequestMapping("/transaction")
//Descrição dele no swagger
@Tag(name = "transaction", description = "Controller/Resource for transactions")
public class TransactionResource {

    @Autowired
    private TransactionService transactionService;

    @PostMapping(produces = "application/json")
    @Operation(
            description = "Create a new transaction",
            summary = "Create a new transaction",
            responses = {
                    @ApiResponse(description = "created", responseCode = "201"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403")
        })
    public ResponseEntity<TransactionDTO> insert(@Valid @RequestBody TransactionDTO dto) {
        TransactionDTO transaction = transactionService.insert(dto);

        return ResponseEntity.ok(transaction);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @PutMapping(value = "/{id}", produces = "application/json")
    @Operation(
            description = "Update transaction",
            summary = "Update transaction",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<TransactionDTO> update(@Valid @PathVariable Long id, @RequestBody TransactionDTO dto) {
        dto = transactionService.update(id, dto);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            description = "Delete transaction",
            summary = "Delete transaction",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping(value = "/{id}/month", produces = "application/json")
    @Operation(
            description = "Get all transactions of current month",
            summary = "Get all transactions of current month",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<Page<MonthDTO>> searchTransactionsCurrentMonth(@PathVariable Long id, Pageable pageable) {
        Page<MonthDTO> page = transactionService.searchTransactionsCurrentMonth(id, pageable);
        return ResponseEntity.ok(page);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping(value = "/{id}/month/{month}", produces = "application/json")
    @Operation(
            description = "Get all transactions of a specific month",
            summary = "Get all transactions of a specific month",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<Page<MonthDTO>> searchTransactionsSpecificMonth(@PathVariable Long id, Pageable pageable, @PathVariable int month) {
        Page<MonthDTO> page = transactionService.searchTransactionsSpecificMonth(id, pageable, month);
        return ResponseEntity.ok(page);
    }
}
