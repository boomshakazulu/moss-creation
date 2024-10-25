import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { RESET_PASSWORD } from "../utils/mutations";
import Auth from "../utils/auth";
import ReviewCard from "../components/reviewCard";
import ReviewInput from "../components/reviewInput";
import OrderDetails from "../components/orderHistoryCard/index";
import "./profile.css";

function Profile() {
  const [editProductId, setEditProductId] = useState(null);
  const [addProductId, setAddProductId] = useState(null);
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
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
        <h2>Order History</h2>

        <div>
          {data.me.orders.slice(0, 5).map((order) => (
            <OrderDetails
              order={order}
              reviews={data.me.reviews}
              key={order._id}
            />
            //   <div key={order._id} className="profile-order">
            //     <h3>
            //       {new Date(parseInt(order.purchaseDate)).toLocaleDateString()}
            //     </h3>
            //     {order.products.map((product) => {
            //       const review = data.me.reviews.find(
            //         (review) => review.itemId._id === product.product._id
            //       );

            //       return (
            //         <div key={product.product._id} className="product-in-order">
            //           <div className="profile-product-img">
            //             <img
            //               src={product.product.photo[0]}
            //               alt={product.product.name}
            //             />
            //             <div>
            //               <h3>{product.product.name}</h3>
            //               <p>Quantity: {product.quantity}</p>
            //             </div>
            //           </div>
            //           {/* Toggle for Edit Review */}
            //           {review && editProductId === product.product._id && (
            //             <div className="profile-review-button">
            //               <button
            //                 onClick={() =>
            //                   toggleEditReview(product.product._id)
            //                 }
            //               >
            //                 {editProductId === product.product._id
            //                   ? "Close Edit Review"
            //                   : "Edit Review"}
            //               </button>
            //               {editProductId === product.product._id && (
            //                 <ReviewCard
            //                   reviewId={review._id}
            //                   username={review.author}
            //                   createdAt={review.createdAt}
            //                   text={review.text}
            //                   rating={review.rating}
            //                   isOwner={true}
            //                 />
            //               )}
            //             </div>
            //           )}

            //           {/* Toggle for Add Review */}
            //           {!review && addProductId === product.product._id && (
            //             <div className="profile-review-button">
            //               <button
            //                 onClick={() => toggleAddReview(product.product._id)}
            //               >
            //                 {addProductId === product.product._id
            //                   ? "Close Add Review"
            //                   : "Add Review"}
            //               </button>
            //               {addProductId === product.product._id && (
            //                 <ReviewInput profileItemId={product.product._id} />
            //               )}
            //             </div>
            //           )}

            //           {/* Render default state (no toggles open) */}
            //           {!review && addProductId !== product.product._id && (
            //             <div className="profile-review-button">
            //               <button
            //                 onClick={() => toggleAddReview(product.product._id)}
            //               >
            //                 Add Review
            //               </button>
            //             </div>
            //           )}

            //           {/* Close button for edit review */}
            //           {review && editProductId !== product.product._id && (
            //             <div className="profile-review-button">
            //               <button
            //                 onClick={() =>
            //                   toggleEditReview(product.product._id)
            //                 }
            //               >
            //                 Edit Review
            //               </button>
            //             </div>
            //           )}
            //         </div>
            //       );
            //     })}
            //     <div className="profile-address">{order.address}</div>
            //     <div className="profile-trackingnum">
            //       {order.trackingNum
            //         ? `Tracking Number: ${order.trackingNum}`
            //         : `Tracking Number is not available yet`}
            //     </div>

            // </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
