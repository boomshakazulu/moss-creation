import { gql } from "@apollo/client";

export const QUERY_CHECKOUT = gql`
  query getCheckout($products: [ID]!) {
    checkout(products: $products) {
      session
    }
  }
`;

export const QUERY_ALL_PRODUCTS = gql`
  {
    products {
      _id
      name
      description
      price
      priceId
      stripeProductId
      photo
      stock
      video
      carousel
    }
  }
`;

export const QUERY_USER = gql`
  {
    user {
      username
      email
      role
      orders {
        _id
        purchaseDate
        products {
          _id
          name
          description
          price
          quantity
          image
        }
      }
    }
  }
`;

export const QUERY_REVIEWS = gql`
  query getReviews($itemId: ID) {
    reviews(itemId: $itemId) {
      _id
      text
      author
      itemId
      createdAt
    }
  }
`;

export const QUERY_PRODUCT = gql`
  query product($itemId: String!) {
    product(itemId: $itemId) {
      _id
      name
      description
      price
      photo
      stock
      video
      carousel
      reviews {
        _id
        text
        author
        itemId
        createdAt
      }
    }
  }
`;
