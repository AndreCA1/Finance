import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    // Validação básica do e-mail
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/recover-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // ← Captura a resposta de erro
        throw new Error(errorData.message || "Erro ao enviar o email");
      }

      toast.success(`Token enviado para ${email}`);
      setStep(2);
    } catch (error) {
      toast.error("Erro ao enviar token: " + error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validações
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!token) {
      toast.error("Por favor, insira o token recebido");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token,
            newPassword,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao redefinir senha");
      }

      toast.success("Senha redefinida com sucesso!");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Erro ao redefinir senha. Tente novamente.");
    }
  };

  // Etapa 1: Solicitar e-mail
  if (step === 1) {
    return (
      <section className="d2c_login_system d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xxl-4 offset-xxl-4">
              <div className="d2c_login_wrapper">
                <div className="text-center mb-4">
                  <h4 className="text-capitalize">Esqueceu a senha?</h4>
                  <p className="text-muted">
                    Digite seu e-mail e enviaremos um token para redefinir sua
                    senha.
                  </p>
                </div>
                <form onSubmit={handleSubmitEmail} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Seu E-mail</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      Enviar Token
                    </button>
                  </div>
                  <a
                    href="/"
                    className="d2c_link_btn btn w-100 d-flex align-items-center justify-content-center text-capitalize"
                  >
                    Voltar para login
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Etapa 2: Inserir token e nova senha
  return (
    <section className="d2c_login_system d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xxl-4 offset-xxl-4">
            <div className="d2c_login_wrapper">
              <div className="text-center mb-4">
                <h4 className="text-capitalize">Redefinir Senha</h4>
                <p className="text-muted">
                  Insira o token recebido em <strong>{email}</strong> e sua nova
                  senha
                </p>
              </div>
              <form onSubmit={handleResetPassword} noValidate>
                <div className="mb-3">
                  <label className="form-label">Token de Confirmação</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o token recebido"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nova Senha</label>

                  <div className="input-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="Digite sua nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength="6"
                      required
                    />
                    <button
                      className="btn ps-0 border-start-0 m-0"
                      type="button"
                      id="button-addon2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <i
                        className={
                          showNewPassword ? "far fa-eye" : "far fa-eye-slash"
                        }
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar Nova Senha</label>

                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength="6"
                      required
                    />
                    <button
                      className="btn ps-0 border-start-0 m-0"
                      type="button"
                      id="button-addon2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <i
                        className={
                          showConfirmPassword
                            ? "far fa-eye"
                            : "far fa-eye-slash"
                        }
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 text-capitalize"
                  >
                    Redefinir Senha
                  </button>
                </div>
                <button
                  type="button"
                  className="d2c_link_btn btn w-100 d-flex align-items-center justify-content-center text-capitalize"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
