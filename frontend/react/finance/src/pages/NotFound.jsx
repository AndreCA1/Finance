import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const previousPage = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (token) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <section class="d2c_error d-flex align-items-center">
      <div class="container">
        <div class="row">
          <div class="col-md-10 col-lg-6 offset-md-1 offset-lg-3">
            <div class="d2c_error_content text-center">
              <h1 class="text-primary fw-semibold">404</h1>
              <h3 class="text-danger text-capitalize">Page Not Found</h3>
              <p class="text-capitalize text-muted">
                Sorry! The page you are looking for Doesn’t exists!
              </p>
              <a onClick={previousPage} class="btn btn-primary">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
