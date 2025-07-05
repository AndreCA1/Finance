package ifmg.edu.br.Finance.services.exceptions;

public class ResourceNotFound extends RuntimeException {
    public ResourceNotFound() {
        //Super invoca um construtor do pai
        super();
    }

    public ResourceNotFound(String message) {
        super(message);
    }
}
