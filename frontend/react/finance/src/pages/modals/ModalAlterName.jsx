import React, { useState, useEffect } from "react";

export default function ModalAlterName({ isOpen, onClose, onSubmit }) {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // Aguarda a animação antes de esconder
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    console.log("SUBMIT - PREVENTING DEFAULT");
    e.preventDefault();

    onClose();
    setFormData({
      name: "",
    });

    onSubmit(formData);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay de fundo escuro */}
      <div
        className={`modal-overlay ${isOpen ? "fade-in" : "fade-out"}`}
        onClick={onClose}
      ></div>

      {/* Modal com fade */}
      <div
        className={`modal d-block ${isOpen ? "fade-in" : "fade-out"}`}
        tabIndex="-1"
        role="dialog"
        style={{
          zIndex: 99999,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <div
          className="modal-dialog modal-lg"
          style={{
            pointerEvents: "auto",
            maxWidth: "800px",
            width: "90%",
          }}
        >
          <div className="modal-content" style={{ borderRadius: "0.5rem" }}>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Edit data</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit} className="d2c_rounded_form">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text" // Corrigido de "name" para "text"
                          className="form-control"
                          id="floatingName"
                          name="name"
                          placeholder="José Silva"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        <label htmlFor="floatingName">Name</label>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top-0">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
