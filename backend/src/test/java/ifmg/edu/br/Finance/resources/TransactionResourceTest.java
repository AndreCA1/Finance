package ifmg.edu.br.Finance.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import ifmg.edu.br.Finance.dtos.TransactionDTO;
import ifmg.edu.br.Finance.services.MonthService;
import ifmg.edu.br.Finance.services.TransactionService;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import ifmg.edu.br.Finance.util.Factory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(TransactionResource.class)
@AutoConfigureMockMvc(addFilters = false)
public class TransactionResourceTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TransactionService transactionService;

    @MockBean
    private MonthService monthService;

    private Long existingId;
    private TransactionDTO transactionDTO;

    @BeforeEach
    void setUp() throws Exception {
        existingId = 1L;
        transactionDTO = Factory.createTransactionDTO(); // Usando a fábrica de DTOs

        // Configuração dos mocks
        when(transactionService.insert(any(TransactionDTO.class))).thenReturn(transactionDTO);
        when(transactionService.update(eq(existingId), any(TransactionDTO.class))).thenReturn(transactionDTO);
        doNothing().when(transactionService).delete(existingId);
        doNothing().when(monthService).generateMonthSummary(any(), any());
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void insertShouldCreateTransactionIfValid() throws Exception {
        TransactionDTO dto = Factory.createTransactionDTO();
        when(transactionService.insert(any())).thenReturn(dto);

        String jsonBody = objectMapper.writeValueAsString(dto);

        ResultActions result = mockMvc.perform(post("/transaction")
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$.id").value(dto.getId()));
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void insertShouldReturnUnprocessableEntityWhenDataIsInvalid() throws Exception {
        // Cria um DTO com dados inválidos (ex: descrição em branco)
        TransactionDTO dto = new TransactionDTO();
        dto.setId(1L);
        dto.setAmount(200.5F);
        dto.setDate(Date.from(Instant.now()));

        String jsonBody = objectMapper.writeValueAsString(dto);

        ResultActions result = mockMvc.perform(post("/transaction")
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        // Espera-se o status 422 para erros de validação
        result.andExpect(status().isUnprocessableEntity());
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void updateShouldReturnTransactionWhenValid() throws Exception {
        TransactionDTO dto = Factory.createTransactionDTO();
        Long id = 1L;

        when(transactionService.update(eq(id), any())).thenReturn(dto);

        String jsonBody = objectMapper.writeValueAsString(dto);

        ResultActions result = mockMvc.perform(put("/transaction/{id}", id)
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$.id").value(dto.getId()));
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void updateShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        Long nonExistentId = 99L; // Um ID que não existe
        TransactionDTO dto = Factory.createTransactionDTO();

        // Simula o service lançando uma exceção quando o ID não é encontrado
        when(transactionService.update(eq(nonExistentId), any())).thenThrow(ResourceNotFound.class);

        String jsonBody = objectMapper.writeValueAsString(dto);

        ResultActions result = mockMvc.perform(put("/transaction/{id}", nonExistentId)
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        // Espera-se o status 404
        result.andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void deleteShouldReturnNoContent() throws Exception {
        Long id = 1L;
        doNothing().when(transactionService).delete(id);

        ResultActions result = mockMvc.perform(delete("/transaction/{id}", id)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void deleteShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        Long nonExistentId = 99L; // Um ID que não existe

        // Simula o service lançando uma exceção ao tentar deletar um ID inexistente
        doThrow(ResourceNotFound.class).when(transactionService).delete(nonExistentId);

        ResultActions result = mockMvc.perform(delete("/transaction/{id}", nonExistentId)
                .accept(MediaType.APPLICATION_JSON));

        // Espera-se o status 404
        result.andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void searchTransactionsCurrentMonthShouldReturnPage() throws Exception {
        long userId = 1L;
        List<TransactionDTO> transactions = List.of(Factory.createTransactionDTO());
        PageImpl<TransactionDTO> page = new PageImpl<>(transactions);

        when(transactionService.searchTransactionsCurrentMonth(eq(userId), any(Pageable.class)))
                .thenReturn(page);

        ResultActions result = mockMvc.perform(get("/transaction/{id}/month", userId)
                .param("page", "0")
                .param("size", "10")
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(transactions.get(0).getId()));
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void searchTransactionsCurrentMonthShouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
        long nonExistentUserId = 99L; // ID de um cliente que não existe

        // Simula o service lançando uma exceção quando o ID do usuário não é encontrado
        when(transactionService.searchTransactionsCurrentMonth(eq(nonExistentUserId), any(Pageable.class)))
                .thenThrow(ResourceNotFound.class);

        ResultActions result = mockMvc.perform(get("/transaction/{id}/month", nonExistentUserId)
                .accept(MediaType.APPLICATION_JSON));

        // Espera-se o status 404 Not Found
        result.andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void searchTransactionsSpecificMonthShouldReturnPage() throws Exception {
        long userId = 1L;
        int month = 7;
        List<TransactionDTO> transactions = List.of(Factory.createTransactionDTO());
        PageImpl<TransactionDTO> page = new PageImpl<>(transactions);

        when(transactionService.searchTransactionsSpecificMonth(eq(userId), any(Pageable.class), eq(month)))
                .thenReturn(page);

        ResultActions result = mockMvc.perform(get("/transaction/{id}/month/{month}", userId, month)
                .param("page", "0")
                .param("size", "10")
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(transactions.get(0).getId()));
    }

    @Test
    @WithMockUser(username = "client", roles = {"ADMIN"})
    void searchTransactionsSpecificMonthShouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
        long nonExistentUserId = 99L; // ID de um cliente que não existe
        int month = 7;

        // Simula o service lançando uma exceção quando o ID do usuário não é encontrado
        when(transactionService.searchTransactionsSpecificMonth(eq(nonExistentUserId), any(Pageable.class), eq(month)))
                .thenThrow(ResourceNotFound.class);

        ResultActions result = mockMvc.perform(get("/transaction/{id}/month/{month}", nonExistentUserId, month)
                .accept(MediaType.APPLICATION_JSON));

        // Espera-se o status 404 Not Found
        result.andExpect(status().isNotFound());
    }
}
