package ifmg.edu.br.Finance.resources;

import ifmg.edu.br.Finance.dtos.MonthDTO;
import ifmg.edu.br.Finance.dtos.TransactionDTO;
import ifmg.edu.br.Finance.services.MonthService;
import ifmg.edu.br.Finance.services.TransactionService;
import ifmg.edu.br.Finance.services.exceptions.DataBaseException;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/month")
//Descrição dele no swagger
@Tag(name = "transaction", description = "Controller/Resource for transactions")
public class MonthResource {

    @Autowired
    private MonthService monthService;

    //@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping(value = "/{id}", produces = "application/json")
    @Operation(
            description = "Get sum of current month",
            summary = "Get sum of current month",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<MonthDTO> searchCurrentMonthReceipt(@PathVariable Long id) {
        MonthDTO page = monthService.searchCurrentMonthReceipt(id);
        return ResponseEntity.ok(page);
    }
}
