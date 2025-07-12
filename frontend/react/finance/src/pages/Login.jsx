import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const clientId = "finance";
    const clientSecret = "myclientsecret";

    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    body.append("grant_type", "password");

    fetch("http://localhost:8080/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: body.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login falhou");
        return res.json();
      })
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token); // Armazena o token
          console.log("Token armazenado:", data.access_token);
          // Redirecionar para outra página
          window.location.href = "/dashboard";
        } else {
          alert("Token não recebido");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erro no login");
      });
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
                  <div className="col">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                      />
                      <label
                        className="form-check-label text-muted"
                        htmlFor="exampleCheck1"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>
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
              <button className="d2c_link_btn btn w-100 d-flex align-items-center justify-content-center text-capitalize">
                <img
                  src="/assets/images/google.png"
                  className="me-2"
                  alt="google image"
                />
                Sign in With Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
