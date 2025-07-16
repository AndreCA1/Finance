import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

export default function EditableName({ initialName = "José Silva", onSubmit }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [tempName, setTempName] = useState(initialName);

  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      confirmEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const confirmEdit = () => {
    if (!tempName.trim()) {
      setTempName(name);

      setEditing(false);
      toast.error("Nome não pode ser vazio");
      return;
    }

    setName(tempName);
    setEditing(false);
    if (onSubmit) onSubmit(tempName);
  };

  const cancelEdit = () => {
    setTempName(name);
    setEditing(false);
  };

  return (
    <div className="d-inline-flex align-items-center gap-2">
      {editing ? (
        <input
          type="text"
          ref={inputRef}
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={confirmEdit}
          className="form-control form-control-sm"
          style={{ maxWidth: "200px" }}
        />
      ) : (
        <>
          <span className="fw-bold mb-0">{name}</span>
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => setEditing(true)}
            aria-label="Editar nome"
          >
            <i className="fas fa-pencil-alt"></i>
          </button>
        </>
      )}
    </div>
  );
}
