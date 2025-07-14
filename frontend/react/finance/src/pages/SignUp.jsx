import React, { useState } from "react";
import { toast } from "react-toastify";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (data) => {
    data.preventDefault();

    if (!termsAccepted) {
      toast.error("Você deve aceitar os termos e condições");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    const fullName = `${firstName} ${lastName}`;
    
    const payload = {
      name: fullName,
      email: email,
      password: password,
    };

    console.log("Enviando dados:", payload);

    
    fetch("http://localhost:8080/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), 
    })
      .then((res) => {
          window.location.href = "/";
      })
  };

  return (
    <section className="d2c_login_system d2c_sign_up d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xxl-4 offset-xxl-4">
            <div className="d2c_login_wrapper">
              <div className="text-center mb-4">
                <h4 className="text-capitalize">Create your account</h4>
                <p className="text-muted">
                  Already have an account?{" "}
                  <a
                    href="/"
                    className="text-capitalize text-primary text-decoration-none d2c_link"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
              <form className="form-validation" noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <div className="row">
                    <div className="col-md mb-3 mb-md-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-md">
                      <label className="form-label d-md-none">Last Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
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
                      placeholder="8+ character required"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="btn ps-0 border-start-0 m-0"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`far ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="form-control border-end-0 m-0"
                      placeholder="Re-enter Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className="btn ps-0 border-start-0 m-0"
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      <i className={`far ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label className="form-check-label text-muted" htmlFor="termsCheck">
                    I accept the{" "}
                    <a href="#" className="d2c_link text-primary text-capitalize">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary w-100 text-capitalize">
                    Sign Up
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
