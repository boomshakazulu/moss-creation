import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";
import "./signup.css"; // Import the CSS file

function Signup(props) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [addUser] = useMutation(ADD_USER);
  const navigate = useNavigate();

  useEffect(() => {
    if (Auth.loggedIn()) {
      navigate("/");
    }
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (formState.password !== formState.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      const mutationResponse = await addUser({
        variables: {
          email: formState.email,
          password: formState.password,
          username: formState.username,
        },
      });

      const token = mutationResponse.data.addUser.token;
      Auth.login(token);
    } catch (error) {
      // Extract error message from the error object
      const errorMessage = error.message;
      if (errorMessage.includes("E11000")) {
        setErrorMessage(
          "Email or username already exists. Please choose a different one."
        );
      } else {
        console.error(errorMessage);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    // Reset password match state and error message when user makes changes
    setPasswordsMatch(true);
    setErrorMessage("");
  };

  return (
    <div className="container my-1">
      <Link to="/login" className="back-link">
        ← Go to Login
      </Link>

      <h2 className="signup-heading">Signup</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <input
            placeholder="Username"
            name="username"
            type="text"
            id="username"
            className="input-field"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <input
            placeholder="Email"
            name="email"
            type="email"
            id="email"
            className="input-field"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <input
            placeholder="Password"
            name="password"
            type="password"
            id="password"
            className="input-field"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            className="input-field"
            onChange={handleChange}
          />
          {!passwordsMatch && (
            <p className="error-message">Passwords do not match</p>
          )}
        </div>
        <div className="flex-row flex-end btnContainer">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
