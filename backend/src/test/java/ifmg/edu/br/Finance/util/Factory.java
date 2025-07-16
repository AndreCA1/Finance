package ifmg.edu.br.Finance.util;


import ifmg.edu.br.Finance.costants.PaymentStatus;
import ifmg.edu.br.Finance.costants.PaymentType;
import ifmg.edu.br.Finance.dtos.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class Factory {
    public static UserInsertDTO createUserInsertDTO(){
        UserInsertDTO user = new UserInsertDTO();
        user.setName("user");
        user.setEmail("email@email.com");
        user.setPassword("password");
        return user;
    }

    public static MonthDTO createMonthDTO() {
        MonthDTO month = new MonthDTO();
        month.setId(1L);
        month.setDate(new Date()); // Usa a data atual
        month.setIncome(5000.0f);
        month.setTotalSpent(2500.50f);
        month.setTotalTransactions(2500.50f);
        month.setTotalCashback(50.25f);
        month.setTotalInvestment(1000.0f);
        month.setUserId(1L);
        return month;
    }

    // Fábrica para TransactionDTO
    public static TransactionDTO createTransactionDTO() {
        TransactionDTO transaction = new TransactionDTO();
        transaction.setId(100L);
        transaction.setDate(new Date());
        transaction.setPayee("Loja de Exemplo");
        transaction.setType(PaymentType.SPENT);
        transaction.setStatus(PaymentStatus.PAID);
        transaction.setAmount(199.99f);
        transaction.setUserId(1L);
        return transaction;
    }

    // Fábrica para UserDTO
    public static UserDTO createUserDTO() {
        UserDTO user = new UserDTO();
        user.setId(1L);
        user.setName("user dto");
        user.setEmail("email.dto@email.com");

        // Cria e adiciona uma role ao conjunto de roles
        Set<RoleDTO> roles = new HashSet<>();
        roles.add(createRoleDTO());
        user.setRoles(roles);

        return user;
    }

    // Fábrica auxiliar para RoleDTO (necessária para createUserDTO)
    public static RoleDTO createRoleDTO() {
        RoleDTO role = new RoleDTO();
        // Supondo que RoleDTO tenha um campo 'authority' ou 'roleName'
        role.setAuthority("ROLE_USER");
        return role;
    }

    public static EmailDTO createEmailDTO(){
        EmailDTO email = new EmailDTO();
        email.setBody("a test mail from tests");
        email.setTo("nobex27770@exitbit.com");
        email.setSubject("Test email");
        return email;
    }

    public static RequestTokenDTO createRequestTokenDTO(String email){
        RequestTokenDTO token = new RequestTokenDTO();
        token.setEmail(email);
        return token;
    }

    public static NewPasswordDTO createNewPasswordDTO(String token){
        NewPasswordDTO newPassword = new NewPasswordDTO();
        newPassword.setToken(token);
        newPassword.setNewPassword("password");
        return newPassword;
    }
}
