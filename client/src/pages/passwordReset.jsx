import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../utils/mutations";
import { Link } from "react-router-dom";

function PasswordReset() {
  const { token } = useParams(); // Extract the token from URL params
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const handleChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordsMatch(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    try {
      await resetPassword({ variables: { token, newPassword } });
      setSuccessMessage("Password reset successfully.");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  return (
    <div className="container">
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            placeholder="New Password"
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Confirm Password"
            type="password"
            id="confirmPassword"
            name="ConfirmPassword"
            value={newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Reset Password"}
        </button>
      </form>
      {!passwordsMatch && (
        <p className="error-message">Passwords do not match</p>
      )}
      {successMessage && (
        <div>
          <p className="success-message">{successMessage}</p>{" "}
          <p>
            Please{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default PasswordReset;
