import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../utils/mutations";
import "./passwordReset.css";

function PasswordReset() {
  const { token } = useParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (successMessage === "Password reset successfully.")
      setTimeout(() => {
        navigate("/login");
      }, 2000);
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    setPasswordsMatch(true);
    setErrorMessage("");
    console.log(formState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    if (!formState.password || !formState.confirmPassword) {
      return;
    }
    try {
      await resetPassword({
        variables: { token, newPassword: formState.password },
      });
      setSuccessMessage("Password reset successfully.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="pass-reset-container">
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            placeholder="New Password"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            placeholder="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleChange}
            required
            className="input-field"
          />
          {!passwordsMatch && (
            <p className="error-message">Passwords do not match</p>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <div className="flex-row flex-end btnContainer">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </div>
      </form>
      {successMessage && (
        <div>
          <p className="success-message">{successMessage}</p>{" "}
        </div>
      )}
    </div>
  );
}

export default PasswordReset;
