import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { FORGOT_PASSWORD } from "../utils/mutations";
import "./forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ variables: { email } });
      navigate("/forgotpassword-confirmation");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        "Unable to process your request at this time. Please check your email address and try again."
      );
    }
  };

  return (
    <div className="container-forgotpass">
      <h2 className="forgotpass-header">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group flex-row space-between my-2">
          <input
            type="email"
            id="email"
            placeholder="Email"
            name="email"
            className="input-field"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="btn-container">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </div>
      </form>
      <p className="remember-message">
        Remember your password?{" "}
        <span className="login-link">
          <Link to="/login">Login</Link>
        </span>
      </p>
      {errorMessage ? (
        <div>
          <p className="error-text">{errorMessage}</p>
        </div>
      ) : null}
    </div>
  );
}

export default ForgotPassword;
