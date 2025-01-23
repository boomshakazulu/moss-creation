import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { RESET_PASSWORD } from "../utils/mutations";
import Auth from "../utils/auth";
import OrderDetails from "../components/orderHistoryCard/index";
import Pagination from "../components/pagination";
import "./profile.css";

function Profile() {
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [resetPassword, { loading: passLoading }] = useMutation(RESET_PASSWORD);
  const loggedIn = Auth.loggedIn();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(QUERY_ME);

  if (!loggedIn) {
    navigate("/login");
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    // Reset password match state and error message when user makes changes
    setPasswordsMatch(true);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    try {
      await resetPassword({ variables: { newPassword: formState.password } });
      setSuccessMessage("Password reset successfully.");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };
  if (loading) {
    return <div>loading...</div>;
  }

  //handles pagination for order history.
  const ordersPerPage = 2;

  const totalPages = Math.ceil(data.me.orders.length / ordersPerPage);

  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = data.me.orders.slice(
    startIndex,
    startIndex + ordersPerPage
  );
  //handles page change to scroll to top
  const handlePageChange = (page) => {
    const scrollLocation = document.getElementById("order-history-title");
    setCurrentPage(page);
    if (scrollLocation) {
      scrollLocation.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-username">{data.me.username}</h1>
      <div className="profile-form-cont">
        <form onSubmit={handleSubmit} className="profile-password-form">
          <label
            htmlFor="profile-newPassword"
            className="profile-password-label"
          >
            Change your password:
          </label>
          <input
            placeholder="New Password"
            type="password"
            id="profile-newPassword"
            name="password"
            value={formState.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Confirm Password"
            type="password"
            id="profile-confirmPassword"
            name="confirmPassword"
            value={formState.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="btn btn-primary profile-save-button"
            disabled={passLoading}
          >
            {passLoading ? "Loading..." : "Change Password"}
          </button>
        </form>
      </div>
      {!passwordsMatch && (
        <p className="error-message">Passwords do not match</p>
      )}
      {successMessage && (
        <div>
          <p className="success-message">{successMessage}</p>{" "}
        </div>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="order-history">
        <h2 id="order-history-title">Order History</h2>

        <div>
          {currentOrders.map((order) => (
            <OrderDetails
              order={order}
              reviews={data.me.reviews}
              key={order._id}
            />
          ))}
          {/* Pagination Controls */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
