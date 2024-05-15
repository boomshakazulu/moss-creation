import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN } from "../utils/mutations";
import Auth from "../utils/auth";
import "./login.css"; // Import the CSS file

function Login(props) {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error }] = useMutation(LOGIN);
  const navigate = useNavigate();

  useEffect(() => {
    if (Auth.loggedIn()) {
      navigate("/");
    }
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container-login my-1">
      <Link to="/signup" className="back-link">
        ← Go to Signup
      </Link>

      <h2 className="login-heading">Login</h2>
      <form onSubmit={handleFormSubmit}>
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
            id="pwd"
            className="input-field"
            onChange={handleChange}
          />
        </div>
        {error ? (
          <div>
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        ) : null}
        <div className="flex-row flex-end btnContainer">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
      <Link to="/forgotpassword" className="forgot-password-link">
        Forgot Password?
      </Link>
    </div>
  );
}

export default Login;
