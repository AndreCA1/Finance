package ifmg.edu.br.Finance.services;

import ifmg.edu.br.Finance.dtos.EmailDTO;
import ifmg.edu.br.Finance.dtos.NewPasswordDTO;
import ifmg.edu.br.Finance.dtos.RequestTokenDTO;
import ifmg.edu.br.Finance.entities.PasswordRecover;
import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.repository.PasswordRecoveryRepository;
import ifmg.edu.br.Finance.repository.UserRepository;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
public class AuthService {

    @Value("${email.password-recover.token.minutes}")
    private int tokenMinutes;

    @Value("${email.password-recover.uri}")
    private String uri;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordRecoveryRepository passwordRecoveryRepository;

    @Transactional
    public PasswordRecover saveRecoverToken(String email) {
        //gera token
        String token = String.format("%06d", new Random().nextInt(1_000_000));

        //inserir no BD
        PasswordRecover passwordRecover = new PasswordRecover();
        passwordRecover.setToken(token);
        passwordRecover.setEmail(email);
        passwordRecover.setExpiration(Instant.now().plusSeconds(tokenMinutes * 60L));

        passwordRecoveryRepository.save(passwordRecover);
        return passwordRecover;
    }

    @Transactional
    public void createRecoverToken(RequestTokenDTO dto) {
        //Busca user pelo email
        User entity = userRepository.findByEmail(dto.getEmail());
        if (entity == null) throw new ResourceNotFound("Email not found!");

        PasswordRecover token = saveRecoverToken(dto.getEmail());

        String body = "Use o código abaixo para redefinir sua senha:" +
                "\n\nCódigo: " + token.getToken() +
                "\nVálido por " + tokenMinutes + " minutos.";
        EmailDTO email = new EmailDTO(entity.getEmail(), "Password Recover", body);
        emailService.sendEmail(email);
    }

    @Transactional
    public void resetPassword(NewPasswordDTO dto) {
        PasswordRecover recover = passwordRecoveryRepository.searchValidToken(dto.getToken(), Instant.now());

        if(recover == null){
            throw new ResourceNotFound("Token not found");
        }

        User entity = userRepository.findByEmail(recover.getEmail());

        entity.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }
}