package ifmg.edu.br.Finance.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import ifmg.edu.br.Finance.dtos.UserDTO;
import ifmg.edu.br.Finance.dtos.UserInsertDTO;
import ifmg.edu.br.Finance.util.Factory;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UserResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Long existingId;
    private Long nonExistingId;
    private UserDTO userDTO;
    private UserInsertDTO userInsertDTO;

    @BeforeEach
    void setUp() throws Exception {
        existingId = 1L;
        nonExistingId = 1000L;
        userDTO = Factory.createUserDTO();
        userInsertDTO = Factory.createUserInsertDTO();
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void findAllShouldReturnPageWhenUserIsAdmin() throws Exception {
        ResultActions result = mockMvc.perform(get("/user")
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk());
        // Ajuste o valor esperado conforme a quantidade de usuários no seu banco de testes
        result.andExpect(jsonPath("$.content").exists());
    }

    @Test
    @WithMockUser(roles = {"USER"})
    public void findAllShouldReturnForbiddenWhenUserIsNotAdmin() throws Exception {
        ResultActions result = mockMvc.perform(get("/user")
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void findByIdShouldReturnUserWhenIdExistsAndUserIsAdmin() throws Exception {
        ResultActions result = mockMvc.perform(get("/user/{id}", existingId)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$.id").value(existingId));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void findByIdShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        ResultActions result = mockMvc.perform(get("/user/{id}", nonExistingId)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = {"USER"})
    public void findByIdShouldReturnForbiddenWhenUserIsNotAdmin() throws Exception {
        ResultActions result = mockMvc.perform(get("/user/{id}", existingId)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = {"USER"})
    public void searchNameByIdShouldReturnNameWhenIdExists() throws Exception {
        ResultActions result = mockMvc.perform(get("/user/name/{id}", existingId)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk());
        result.andExpect(content().string("User One"));
    }

    @Test
    @WithMockUser(roles = {"USER"})
    public void searchNameByIdShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        ResultActions result = mockMvc.perform(get("/user/name/{id}", nonExistingId)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isNotFound());
    }

    @Test
    public void insertShouldCreateUser() throws Exception {
        // Endpoint é público, não precisa de @WithMockUser
        String jsonBody = objectMapper.writeValueAsString(userInsertDTO);

        ResultActions result = mockMvc.perform(post("/user")
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isCreated());
        result.andExpect(jsonPath("$.id").exists());
        result.andExpect(jsonPath("$.name").value(userInsertDTO.getName()));
    }

    @Test
    public void insertShouldReturnUnprocessableEntityWhenNameIsBlank() throws Exception {
        userInsertDTO.setName(""); // Assumindo validação @NotBlank no DTO
        String jsonBody = objectMapper.writeValueAsString(userInsertDTO);

        ResultActions result = mockMvc.perform(post("/user")
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isUnprocessableEntity());
    }

    // --- update ---
    @Test
    @WithMockUser(roles = {"USER"})
    public void updateShouldUpdateUserWhenIdExistsAndUserIsAuthenticated() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(userDTO);

        ResultActions result = mockMvc.perform(put("/user/{id}", existingId)
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$.id").value(existingId));
        result.andExpect(jsonPath("$.name").value(userDTO.getName()));
    }

    @Test
    @WithMockUser(roles = {"USER"})
    public void updateShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(userDTO);

        ResultActions result = mockMvc.perform(put("/user/{id}", nonExistingId)
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        result.andExpect(status().isNotFound());
    }

    // --- delete ---
    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void deleteShouldDeleteUserWhenIdExistsAndUserIsAdmin() throws Exception {
        ResultActions result = mockMvc.perform(delete("/user/{id}", existingId));

        result.andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = {"USER"})
    public void deleteShouldDeleteUserWhenIdExistsAndUserIsUser() throws Exception {
        // Usando um ID diferente para não conflitar com o teste de admin, se executados em paralelo sem @Transactional
        Long userDeletableId = 2L;
        ResultActions result = mockMvc.perform(delete("/user/{id}", userDeletableId));

        result.andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void deleteShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        ResultActions result = mockMvc.perform(delete("/user/{id}", nonExistingId));

        result.andExpect(status().isNotFound());
    }
}