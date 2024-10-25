import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";
import {
  CHECK_EMAIL_UNIQUENESS,
  CHECK_USERNAME_UNIQUENESS,
} from "../utils/queries";
import "./signup.css"; // Import the CSS file

function Signup(props) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailUnique, setEmailUnique] = useState(true);
  const [usernameUnique, setUsernameUnique] = useState(true);

  const [
    checkEmail,
    { loading: emailLoading, error: emailError, data: emailData },
  ] = useLazyQuery(CHECK_EMAIL_UNIQUENESS, {
    variables: { email: formState.email },
    onCompleted: () => {
      setEmailUnique(emailData.checkEmailUniqueness);
    },
    onError: () => {
      setEmailUnique(false);
    },
    skip: !formState.email,
  });
  const [
    checkUsername,
    { loading: usernameLoading, error: usernameError, data: usernameData },
  ] = useLazyQuery(CHECK_USERNAME_UNIQUENESS, {
    variables: { username: formState.username },
    onCompleted: () => {
      setUsernameUnique(usernameData.checkUsernameUniqueness);
    },
    onError: () => {
      setUsernameUnique(false);
    },
    skip: !formState.username,
  });
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

    if (!emailUnique || !usernameUnique) {
      return;
    }

    if (!formState.email || !formState.username || !formState.password) {
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
      setErrorMessage(null);
    } catch (error) {
      // Extract error message from the error object
      setErrorMessage(error.message);
      if (errorMessage.includes("E11000")) {
        setErrorMessage(
          "Email or username already exists. Please choose a different one."
        );
      } else {
        setErrorMessage(
          "We are unable to process your request. Please check your information and try again."
        );
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

    // Check for uniqueness when the email or username input changes
    if (name === "email" && value) {
      checkEmail({ variables: { email: value } });
    }

    if (name === "username" && value) {
      checkUsername({ variables: { username: value } });
    }
  };

  return (
    <div className="container-signup my-1">
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
        {usernameLoading && <p className="loading-message">Checking...</p>}
        {!usernameUnique && (
          <p className="error-message">Username already taken</p>
        )}
        <div className="flex-row space-between my-2 no-wrap">
          <input
            placeholder="Email"
            name="email"
            type="email"
            id="email"
            className="input-field"
            onChange={handleChange}
          />
        </div>
        {emailLoading && <p className="loading-message">Checking...</p>}
        {!emailUnique && (
          <p className="error-message unique-error">Email already taken</p>
        )}
        <div className="flex-row space-between my-2 no-wrap">
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
