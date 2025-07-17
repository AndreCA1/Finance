package ifmg.edu.br.Finance.resources;

import ifmg.edu.br.Finance.dtos.UserDTO;
import ifmg.edu.br.Finance.dtos.UserInsertDTO;
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
@RequestMapping("/user")
//Descrição dele no swagger
@Tag(name = "User", description = "Controller/Resource for users")
public class UserResource {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping(produces = "application/json")
    @Operation(
            description = "Find all users",
            summary = "Find all users",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403")
            })
    //Pageable tem todas as propridades de paginação
    public ResponseEntity<Page<UserDTO>> findAll(Pageable pageable) {
        Page<UserDTO> users = userService.findAll(pageable);
        //Nova sintaxe
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping(value = "/{id}", produces = "application/json")
    @Operation(
            description = "Find user by ID",
            summary = "Find user by ID",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<UserDTO> findById(@PathVariable Long id) {
        UserDTO user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping(value = "/name/{id}", produces = "application/json")
    @Operation(
            description = "Find user name by ID",
            summary = "Find user name by ID",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public String searchNameById(@PathVariable Long id) {
        UserDTO user = userService.findById(id);
        return user.getName();
    }

    @PostMapping(produces = "application/json")
    @Operation(
            description = "Create a new user",
            summary = "Create a new user",
            responses = {
                    @ApiResponse(description = "created", responseCode = "201"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403")
        })
    public ResponseEntity<UserDTO> insert(@Valid @RequestBody UserInsertDTO dto) {
        UserDTO user = userService.insert(dto);

        //Pegar o caminho da minha aplicação da requisição atual e adiciona uma nova parte com o id
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(user);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @PutMapping(value = "/{id}", produces = "application/json")
    @Operation(
            description = "Update user",
            summary = "Update user",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<UserDTO> update(@Valid @PathVariable Long id, @RequestBody UserDTO dto) {
        dto = userService.update(id, dto);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(
            description = "Delete user",
            summary = "Delete user",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
