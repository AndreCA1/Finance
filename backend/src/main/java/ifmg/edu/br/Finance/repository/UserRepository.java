package ifmg.edu.br.Finance.repository;

import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.projections.UserDetailsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByEmailAndPassword(String email, String password);

    @Query(nativeQuery = true,
           value = """
                    SELECT u.email as UserEmail,
                           u.password,
                           r.id as RoleId,
                           r.authority
                    FROM tb_user u 
                        INNER JOIN tb_user_role ur 
                                ON u.id = ur.user_id 
                                    INNER JOIN tb_role r 
                                        ON r.id = ur.role_id
                    WHERE u.email = :username
                   """
    )
    List<UserDetailsProjection> searchUserAndRoleByEmail(String username);
}
