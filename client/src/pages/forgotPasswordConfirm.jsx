import React from "react";

function ForgotPasswordConfirmation() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
      <h2
        style={{
          marginTop: "30px",
          marginBottom: "20px",
          textAlign: "center",
          color: "#72b787",
        }}
      >
        Password Reset Request Submitted
      </h2>
      <p style={{ color: "#333" }}>
        If your email exists in our system, you will receive an email shortly
        with instructions on how to reset your password.
        <br></br>
        <br></br>
        If you do not recieve an email please check your spam folder for an
        email from <br></br> "support@mossy-creations.com"
      </p>
    </div>
  );
}

export default ForgotPasswordConfirmation;
