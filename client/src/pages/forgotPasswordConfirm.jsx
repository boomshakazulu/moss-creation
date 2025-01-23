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
      <p style={{ color: "#72b787", textAlign: "center" }}>
        If your email exists in our system, you will receive an email shortly
        with instructions on how to reset your password.
        <br></br>
        <br></br>
        If you do not recieve an email please check your spam folder for an
        email from <br></br>{" "}
        <a href="mailto:support@mossy-creations.com" style={{ color: "blue" }}>
          support@mossy-creations.com
        </a>
      </p>
    </div>
  );
}

export default ForgotPasswordConfirmation;
