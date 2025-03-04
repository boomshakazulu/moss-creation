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
import Pagination from "../components/pagination";
import "./product.css";
import TopBanner from "../components/topBanner/index.jsx";

function Product() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useStoreContext();
  const [disableReview, setDisableReview] = useState(false);
  const [loadingReview, setLoadingReview] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data } = useQuery(QUERY_PRODUCT, {
    variables: { itemId },
    fetchPolicy: "network-only",
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
    if (!loading && data.product) {
      setLoadingReview(false);
    }
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

  const addToCart = () => {
    const {
      photo,
      name,
      _id,
      price,
      stock,
      currentPage,
      averageRating,
      totalRatings,
    } = data.product;

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
    setAddedToCart(true);
  };

  const buyNow = () => {
    navigate("/checkout", { state: { buyNow: { ...data } } });
  };

  //handles pagination for review cards
  const reviewsPerPage = 4;

  const totalPages = Math.ceil(data.product.reviews.length / reviewsPerPage);

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = data.product.reviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  const handlePageChange = (page) => {
    const scrollLocation = document.getElementById("review-header");
    setCurrentPage(page);
    if (scrollLocation) {
      scrollLocation.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="product-container">
      <TopBanner />
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
              {data.product.totalRatings ? (
                <div className="prod-rating-cont">
                  <StarRating
                    averageRating={data.product.averageRating || 5}
                    productPage={true}
                  />
                  ({data.product.totalRatings})
                </div>
              ) : (
                ""
              )}
              <p className="product-stock">
                {data.product.stock > 0 && data.product.active
                  ? `${data.product.stock} In Stock`
                  : "Out of Stock"}
              </p>
            </div>
            {data.product.stock > 0 && data.product.active ? (
              <Row>
                <div className="product-btn-container">
                  {addedToCart ? (
                    <Button
                      variant="success"
                      className="product-btn-atc"
                      disabled
                    >
                      Added to Cart
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      className="product-btn-atc"
                      onClick={addToCart}
                    >
                      Add to Cart
                    </Button>
                  )}
                  <Button
                    variant="success"
                    className="product-btn-buyNow"
                    onClick={buyNow}
                  >
                    Buy Now
                  </Button>
                </div>
              </Row>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
      <div>
        {purchasedProduct && !disableReview ? (
          <ReviewInput productPage={true} />
        ) : (
          ""
        )}
      </div>
      {data?.product?.reviews?.length > 0 ? (
        <div id="review-header">
          <ReviewList
            reviews={data.product.reviews}
            currentUser={loggedInUser ? queryResult.data.me.username : null}
            productPage={true}
          />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <h4>This Product hasn't been reviewed</h4>
      )}
    </div>
  );
}

export default Product;
