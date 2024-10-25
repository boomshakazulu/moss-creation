import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import ReviewCard from "../reviewCard";
import ReviewInput from "../reviewInput";
import "./style.css";

const OrderDetails = (order) => {
  const [editProductId, setEditProductId] = useState(null);
  const [addProductId, setAddProductId] = useState(null);
  const {
    address,
    fulfilled,
    price,
    products,
    purchaseDate,
    trackingNum,
    carrier,
  } = order.order;

  let trackingWebsite;

  switch (carrier) {
    case "UPS":
      trackingWebsite = `https://www.ups.com/track?loc=en_US&tracknum=${trackingNum}`;
      break;
    case "Fedex":
      trackingWebsite = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`;
      break;
    case "USPS":
      trackingWebsite = `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNum}`;
      break;
    default:
      trackingWebsite = null;
  }

  // Function to toggle edit review section for a product
  const toggleEditReview = (productId) => {
    setEditProductId(editProductId === productId ? null : productId);
    setAddProductId(null); // Close add review section if open
  };

  // Function to toggle add review section for a product
  const toggleAddReview = (productId) => {
    setAddProductId(addProductId === productId ? null : productId);
    setEditProductId(null); // Close edit review section if open
  };

  if (!order) {
    return;
  }

  return (
    <section>
      <MDBContainer className="h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol
            md="10"
            lg="8"
            xl="6"
            className="justify-content-center align-items-center MBDCol-history"
          >
            <MDBCard className="card-stepper" style={{ borderRadius: "16px" }}>
              <MDBCardHeader className="p-4 orderHistHeader">
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <p className="text-muted mb-0">
                      Placed On{" "}
                      <span className="fw-bold text-body">
                        {new Date(parseInt(purchaseDate)).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              </MDBCardHeader>
              <MDBCardBody className="p-4">
                {products.map((product) => {
                  let review;
                  if (order.reviews) {
                    review = order.reviews.find(
                      (review) => review.itemId._id === product.product._id
                    );
                  }

                  return (
                    <div
                      className="product-container mb-4 pb-2"
                      key={product.product._id}
                    >
                      <div className="d-flex flex-row mb-3">
                        <div className="flex-fill">
                          <MDBTypography tag="h5" className="bold">
                            {product.product.name}
                          </MDBTypography>
                          <p className="text-muted">
                            Qty: {product.quantity} item
                          </p>
                        </div>
                        <div>
                          <MDBCardImage
                            fluid
                            className="align-self-center"
                            src={product.product.photo[0]}
                            width="250"
                          />
                        </div>
                      </div>
                      {/* Review Actions */}
                      <div className="review-actions">
                        {review && editProductId === product.product._id && (
                          <div className="review-toggle">
                            <button
                              className="btn-primary"
                              onClick={() =>
                                toggleEditReview(product.product._id)
                              }
                            >
                              {editProductId === product.product._id
                                ? "Close Review"
                                : "View Review"}
                            </button>
                            {editProductId === product.product._id && (
                              <ReviewCard
                                reviewId={review._id}
                                username={review.author}
                                createdAt={review.createdAt}
                                text={review.text}
                                rating={review.rating}
                                isOwner={true}
                                revItemId={review.itemId._id}
                              />
                            )}
                          </div>
                        )}

                        {!review && addProductId === product.product._id && (
                          <div className="review-toggle">
                            <button
                              className="btn-primary"
                              onClick={() =>
                                toggleAddReview(product.product._id)
                              }
                            >
                              {addProductId === product.product._id
                                ? "Close Add Review"
                                : "Add Review"}
                            </button>
                            {addProductId === product.product._id && (
                              <ReviewInput
                                profileItemId={product.product._id}
                              />
                            )}
                          </div>
                        )}

                        {!review && addProductId !== product.product._id && (
                          <div className="review-toggle">
                            <button
                              className="btn-primary"
                              onClick={() =>
                                toggleAddReview(product.product._id)
                              }
                            >
                              Add Review
                            </button>
                          </div>
                        )}

                        {review && editProductId !== product.product._id && (
                          <div className="review-toggle">
                            <button
                              className="btn-primary"
                              onClick={() =>
                                toggleEditReview(product.product._id)
                              }
                            >
                              View Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div>
                  <MDBTypography tag="h4" className="mb-3">
                    Total: ${price}
                  </MDBTypography>
                </div>
                <ul id="progressbar-1" className="mx-0 mt-0 px-0 pt-0 pb-4">
                  <li className="step0 active" id="step1">
                    <span style={{ marginRight: "50px", marginTop: "12px" }}>
                      PLACED
                    </span>
                  </li>
                  <li
                    className={`step2 ${fulfilled ? "active" : ""} text-center`}
                    id="step2"
                  >
                    <span style={{ marginLeft: "50px", marginTop: "12px" }}>
                      SHIPPED
                    </span>
                  </li>
                </ul>
                <MDBTypography tag="h5" className="bold">
                  Shipped to:
                </MDBTypography>
                <span>{address}</span>
              </MDBCardBody>
              <MDBCardFooter className="p-4">
                <div className="d-flex justify-content-between">
                  {trackingNum && (
                    <MDBTypography tag="h5" className="fw-normal mb-0 track">
                      <a
                        href={trackingWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Track
                      </a>
                    </MDBTypography>
                  )}
                  <div className="border-start h-100"></div>
                  <MDBTypography tag="h5" className="fw-normal mb-0">
                    <a href="#!" className="text-muted">
                      <MDBIcon fas icon="ellipsis-v" />
                    </a>
                  </MDBTypography>
                </div>
              </MDBCardFooter>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default OrderDetails;
