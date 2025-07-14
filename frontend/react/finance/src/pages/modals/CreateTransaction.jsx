import React, { useState, useEffect } from "react";

export default function CreateTransactionModal({ isOpen, onClose, onSubmit }) {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    customerName: "",
    actionType: "",
    paymentStatus: "",
    amount: "",
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
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      date: "",
      customerName: "",
      actionType: "",
      paymentStatus: "",
      amount: "",
    });
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
          zIndex: 1050,
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
          role="document"
          style={{ pointerEvents: "auto" }}
        >
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Criar Transação</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  {/* Data */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Nome do Cliente */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome do Cliente</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Ex: João da Silva"
                      required
                    />
                  </div>

                  {/* Tipo de Ação */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo de Ação</label>
                    <select
                      className="form-control"
                      name="actionType"
                      value={formData.actionType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="INVESTMENT">Investimento</option>
                      <option value="SPENT">Gasto</option>
                      <option value="CASHBACK">Cashback</option>
                    </select>
                  </div>

                  {/* Tipo de Pagamento */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo de Pagamento</label>
                    <select
                      className="form-control"
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="CARD">Cartão</option>
                      <option value="PAID">Pago</option>
                      <option value="UNPAID">Não Pago</option>
                    </select>
                  </div>

                  {/* Quantia */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantia (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Ex: 1500.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
