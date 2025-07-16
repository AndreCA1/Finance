package ifmg.edu.br.Finance.resources;

import ifmg.edu.br.Finance.dtos.RequestTokenDTO;
import ifmg.edu.br.Finance.dtos.NewPasswordDTO;
import ifmg.edu.br.Finance.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "User", description = "Controller/Resource for users")
public class AuthResource {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/recover-token")
    @Operation(
            description = "Generate a six digits token and send to user email",
            summary = "Generate recover token",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<Void> createRecoverToken(@Valid @RequestBody RequestTokenDTO dto){
        authService.createRecoverToken(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/reset-password")
    @Operation(
            description = "Validates the token and resets the password",
            summary = "Reset password",
            responses = {
                    @ApiResponse(description = "Ok", responseCode = "200"),
                    @ApiResponse(description = "Bad request", responseCode = "400"),
                    @ApiResponse(description = "UnAuthorized", responseCode = "401"),
                    @ApiResponse(description = "Forbidden", responseCode = "403"),
                    @ApiResponse(description = "NotFound", responseCode = "404")
            })
    public ResponseEntity<Void> resetPassword(@RequestBody NewPasswordDTO dto) {
        authService.resetPassword(dto); //
        return ResponseEntity.noContent().build();
    }
}
