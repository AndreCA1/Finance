package ifmg.edu.br.Finance.projections;

public interface UserDetailsProjection {
    String getUserEmail();
    String getPassword();
    Long getRoleId();
    String getAuthority();
    long getUserId();
}
