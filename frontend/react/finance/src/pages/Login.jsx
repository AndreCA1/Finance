import React, { useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientId = "finance";
    const clientSecret = "myclientsecret";
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    body.append("grant_type", "password");

    try {
      // 1. Primeiro fetch: obter o token
      const tokenRes = await fetch("http://localhost:8080/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
        body: body.toString(),
      });

      if (!tokenRes.ok) throw new Error("Login falhou");

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) throw new Error("Token não recebido");

      localStorage.setItem("access_token", accessToken);
      console.log("Token armazenado:", accessToken);

      const tokenDecoded = jwtDecode(accessToken);
      const userIdToken = tokenDecoded.user_id;

      // 2. Segundo fetch: obter nome usando o token
      const userRes = await fetch(
        "http://localhost:8080/user/name/" + userIdToken,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!userRes.ok) throw new Error("Erro ao buscar nome do usuário");

      const userData = await userRes.text();

      if (userData) {
        localStorage.setItem("username", userData);
        window.location.href = "/dashboard";
      } else {
        toast.error("Nome não recebido");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro no nome: " + err.message);
    }
  };

  return (
    <section className="d2c_login_system d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xxl-4 offset-xxl-4">
            <div className="d2c_login_wrapper">
              <div className="text-center mb-4">
                <h4 className="text-capitalize">Login</h4>
                <p className="text-muted">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-capitalize text-primary text-decoration-none d2c_link"
                  >
                    Sign up here
                  </a>
                </p>
              </div>
              <form
                className="form-validation"
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control border-end-0"
                      placeholder="Enter password"
                      aria-describedby="button-addon2"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="btn ps-0 border-start-0 m-0"
                      type="button"
                      id="button-addon2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={
                          showPassword ? "far fa-eye" : "far fa-eye-slash"
                        }
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col text-end ps-0">
                    <a
                      href="/forgetPassword"
                      className="d2c_link text-primary text-capitalize"
                    >
                      Forget Password?
                    </a>
                  </div>
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 text-capitalize"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
