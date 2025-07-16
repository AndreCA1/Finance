package ifmg.edu.br.Finance.util;


import ifmg.edu.br.Finance.dtos.EmailDTO;
import ifmg.edu.br.Finance.dtos.NewPasswordDTO;
import ifmg.edu.br.Finance.dtos.RequestTokenDTO;
import ifmg.edu.br.Finance.dtos.UserInsertDTO;

import java.time.Instant;
import java.util.Date;

public class Factory {
    public static UserInsertDTO createUserInsertDTO(){
        UserInsertDTO user = new UserInsertDTO();
        user.setName("user");
        user.setEmail("email@email.com");
        user.setPassword("password");
        return user;
    }

//    public static RoomDTO createRoomDTO(){
//        RoomDTO room = new RoomDTO();
//        room.setDescription("teste");
//        room.setPrice(1000);
//        room.setImageUrl("https://example.com/quarto1.jpg");
//        return room;
//    }
//
//    public static DailyInsertDTO createDailyInsertDTO(Long clientId, Long roomId){
//        DailyInsertDTO daily = new DailyInsertDTO();
//
//        daily.setClient(clientId);
//        daily.setRoom(roomId);
//        daily.setDailyDate(Date.from(Instant.now()));
//        return daily;
//    }

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
