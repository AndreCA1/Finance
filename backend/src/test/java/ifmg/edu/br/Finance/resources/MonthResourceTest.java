package ifmg.edu.br.Finance.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import ifmg.edu.br.Finance.costants.PaymentType;
import ifmg.edu.br.Finance.entities.Month;
import ifmg.edu.br.Finance.entities.Transaction;
import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.repository.MonthRepository;
import ifmg.edu.br.Finance.repository.TransactionRepository;
import ifmg.edu.br.Finance.repository.UserRepository;
import ifmg.edu.br.Finance.services.MonthService;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;


@WebMvcTest(MonthResource.class)
@AutoConfigureMockMvc(addFilters = false)
class MonthResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MonthService monthService;

    @MockBean
    private TransactionRepository transactionRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private MonthRepository monthRepository;

    private Long existingUserId;
    private Long nonExistingUserId;

    @BeforeEach
    void setUp() {
        existingUserId = 2L;
        nonExistingUserId = 10L;
    }

    @Test
    void testSearchCurrentMonthReceipt() throws Exception {
        mockMvc.perform(get("/month/" + existingUserId).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testSearchAllMonthsReceipt() throws Exception {
        mockMvc.perform(get("/month/{id}/all", existingUserId) // Use a URL do novo endpoint
                        // Adicione parâmetros de paginação à requisição
                        .param("page", "0")
                        .param("size", "10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testSearchCurrentMonthReceipt_UserNotFound() throws Exception {
        when(monthService.searchCurrentMonthReceipt(nonExistingUserId))
                .thenThrow(new ResourceNotFound("User not found"));

        mockMvc.perform(get("/month/" + nonExistingUserId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testSearchAllMonthsReceipt_UserNotFound() throws Exception {
        when(monthService.searchAllMonthReceipt(eq(nonExistingUserId), any(Pageable.class)))
                .thenThrow(new ResourceNotFound("User not found"));

        mockMvc.perform(get("/month/{id}/all", nonExistingUserId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
