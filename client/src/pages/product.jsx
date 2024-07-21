import React, { useState, useEffect } from "react";
import { QUERY_PRODUCT, QUERY_ME } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/carousel/index.jsx";
import StarRating from "../components/starRating/index.jsx";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useStoreContext } from "../utils/GlobalState.jsx";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../utils/actions";
import Auth from "../utils/auth.js";
import { idbPromise } from "../utils/helpers";
import ReviewInput from "../components/reviewInput/index";
import ReviewList from "../components/reviewList/index.jsx";
import "./product.css";

function Product() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useStoreContext();
  const [disableReview, setDisableReview] = useState(false);
  const [loadingReview, setLoadingReview] = useState(true);
  const { loading, error, data } = useQuery(QUERY_PRODUCT, {
    variables: { itemId },
  });
  const loggedInUser = Auth.loggedIn();

  useEffect(() => {
    if (!loading && data.product && loggedInUser) {
      const profile = Auth.getProfile();
      const loggedInUser = profile.data.username; // Get the username of the logged-in user
      const hasReviewed = data.product.reviews.some(
        (review) => review.author === loggedInUser
      );
      setDisableReview(hasReviewed);
      setLoadingReview(false);
    }
    setLoadingReview(false);
  }, [loading, data, loadingReview]);

  const { cart } = state;

  let loadMe = false;
  let errMe = null;
  let dataMe = null;
  let purchasedProduct = false;

  let queryResult = {};
  if (loggedInUser) {
    queryResult = useQuery(QUERY_ME);
  }

  // Destructure the query result
  ({ loading: loadMe, error: errMe, data: dataMe } = queryResult);

  // Check if the data is loaded and contains the necessary information
  if (!loadMe && !errMe && dataMe && loggedInUser) {
    purchasedProduct = dataMe.me.orders.some((order) =>
      order.products.some((product) => product.product._id === itemId)
    );
  }

  // Show loading indicator while data is being fetched
  if (loading || loadMe || loadingReview) return <p>Loading...</p>;
  // Show error message if there's an error fetching data
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  console.log(purchasedProduct);

  console.log("disable review:", disableReview);

  const addToCart = () => {
    const itemInCart = cart.find(
      (cartItem) => cartItem._id === data.product._id
    );
    if (itemInCart) {
      const newQuantity = parseInt(itemInCart.purchaseQuantity) + 1;
      if (newQuantity <= itemInCart.stock) {
        dispatch({
          type: UPDATE_CART_QUANTITY,
          _id: _id,
          purchaseQuantity: newQuantity,
        });
        idbPromise("cart", "put", {
          ...itemInCart,
          purchaseQuantity: newQuantity,
        });
      } else {
        console.log("Cannot add more than available stock");
      }
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...data.product, purchaseQuantity: 1 },
      });
      idbPromise("cart", "put", { ...data.product, purchaseQuantity: 1 });
    }
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  console.log(queryResult);
  console.log(data.product);

  return (
    <div>
      <Container className="product-section">
        <h1 className="product-title">{data.product.name}</h1>
        <Row>
          <Col xs={12} md={6} className="carousel-column">
            <div className="carousel-container">
              <Carousel items={data.product} />
            </div>
          </Col>
          <Col className="info-col">
            <div className="product-info-container">
              <p
                className="product-description"
                dangerouslySetInnerHTML={{ __html: data.product.description }}
              ></p>
              <h2 className="product-price">${data.product.price}</h2>
              <div className="prod-rating-cont">
                <StarRating averageRating={data.product.averageRating || 5} />(
                {data.product.totalRatings})
              </div>
              <p className="product-stock">
                {data.product.stock > 0
                  ? `${data.product.stock} In Stock`
                  : "Out of Stock"}
              </p>
            </div>
            {data.product.stock > 0 && (
              <Row>
                <div className="product-btn-container">
                  <Button
                    variant="success"
                    className="product-btn-atc"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Button>{" "}
                  <Button
                    variant="success"
                    className="product-btn-buyNow"
                    onClick={buyNow}
                  >
                    Buy Now
                  </Button>
                </div>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
      <div>{purchasedProduct && !disableReview ? <ReviewInput /> : ""}</div>
      {data.product.reviews && data.product.reviews.length > 0 ? (
        <ReviewList
          reviews={data.product.reviews}
          currentUser={loggedInUser ? queryResult.data.me.username : null}
        />
      ) : (
        <h4>This Product hasn't been reviewed</h4>
      )}
    </div>
  );
}

export default Product;
