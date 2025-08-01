package ifmg.edu.br.Finance.services;

import ifmg.edu.br.Finance.dtos.RoleDTO;
import ifmg.edu.br.Finance.dtos.UserDTO;
import ifmg.edu.br.Finance.dtos.UserInsertDTO;
import ifmg.edu.br.Finance.entities.Role;
import ifmg.edu.br.Finance.entities.User;
import ifmg.edu.br.Finance.projections.UserDetailsProjection;
import ifmg.edu.br.Finance.repository.RoleRepository;
import ifmg.edu.br.Finance.repository.UserRepository;
import ifmg.edu.br.Finance.services.exceptions.DataBaseException;
import ifmg.edu.br.Finance.services.exceptions.EmailException;
import ifmg.edu.br.Finance.services.exceptions.ResourceNotFound;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<UserDTO> findAll(Pageable page){
        Page<User> list = repository.findAll(page);
        return list.map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public UserDTO findById(Long id){
        Optional<User> opt = repository.findById(id);
        User user = opt.orElseThrow(() -> new ResourceNotFound("User not found"));
        return new UserDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO findByUsername(String username) {
        User opt = repository.findByEmail(username);
        return new UserDTO(opt);
    }

    @Transactional(readOnly = true)
    public UserDetailsProjection searchUserAndRoleByEmail(String username) {
        List<UserDetailsProjection> result = repository.searchUserAndRoleByEmail(username);
        if (result.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return result.get(0);
    }


    @Transactional
    public UserDTO insert(UserInsertDTO dto){

        User test = repository.findByEmail(dto.getEmail());
        if(test != null) throw new EmailException("Email already registered");

        User entity = new User();

        copyDtoToEntity(dto, entity);

        entity.setPassword(passwordEncoder.encode(dto.getPassword()));

        entity.getRoles().clear();
        entity.addRole(roleRepository.getReferenceById(1L));

        User novo = repository.save(entity);

        return new UserDTO(novo);
    }

    @Transactional
    public UserDTO update(Long id, UserDTO dto) {
        try{
            User entity = repository.findById(id).orElseThrow(() -> new ResourceNotFound("User not found: " + id));

            //O nome é a única coisa q pode ser alterada
            entity.setName(dto.getName());

            entity = repository.save(entity);
            return new UserDTO(entity);

        } catch (EntityNotFoundException e) {
            throw new ResourceNotFound("User not found: " + id);
        }
    }

    @Transactional
    public void delete(Long id) {
        if(!repository.existsById(id)) {
            throw new ResourceNotFound("User not found: " + id);
        }
        try{
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Integrity violation");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<UserDetailsProjection> result = repository.searchUserAndRoleByEmail(username);

        if (result.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }

        User user = new User();
        user.setEmail(result.get(0).getUserEmail());
        user.setPassword(result.get(0).getPassword());
        for (UserDetailsProjection p : result){
            user.addRole(new Role(p.getRoleId(), p.getAuthority()));
        }
        return user;
    }

    private void copyDtoToEntity(UserDTO dto, User entity) {
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());

        entity.getRoles().clear();
        if (dto.getRoles() != null){
            for (RoleDTO r : dto.getRoles()){
                Role role = roleRepository.getReferenceById(r.getId());
                entity.addRole(role);
            }
        }
    }
}
