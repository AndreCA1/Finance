package ifmg.edu.br.Finance.services.exceptions;

public class DataBaseException extends RuntimeException {
    public DataBaseException() {
        super();
    }
    public DataBaseException(String message) {
        super(message);
    }
}
