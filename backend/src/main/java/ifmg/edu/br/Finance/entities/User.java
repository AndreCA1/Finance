package ifmg.edu.br.Finance.entities;

import ifmg.edu.br.Finance.dtos.UserDTO;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

@Entity
@Table(name = "tb_user")
public class User implements UserDetails {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NonNull
    private String name;

    @NonNull
    @Column(unique = true)
    private String email;
    @NonNull
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "tb_user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
        )
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private List<Month> lastMonths = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Transaction> transactions = new ArrayList<>();

    public void addRole(Role role){
        roles.add(role);
    }

    public boolean hasRole(String roleName){
        return roles.stream().filter(r -> r.getAuthority().equals(roleName)).toList().isEmpty();
    }

    @Override
    public String getUsername(){
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }
}
