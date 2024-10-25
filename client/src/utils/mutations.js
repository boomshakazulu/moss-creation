import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        role
      }
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder($products: [ID]!, $stripePaymentIntentId: String) {
    addOrder(
      products: $products
      stripePaymentIntentId: $stripePaymentIntentId
    ) {
      purchaseDate
      stripePaymentIntentId
      products
      address
      price
      trackingNum
      fulfilled
      name
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation addReview($text: String!, $itemId: ID!, $rating: Int) {
    addReview(text: $text, itemId: $itemId, rating: $rating) {
      _id
      text
      author
      itemId {
        _id
      }
      rating
      createdAt
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation updateOrder($orderId: ID!, $stripePaymentIntentId: String) {
    updateOrder(
      orderId: $orderId
      stripePaymentIntentId: $stripePaymentIntentId
    ) {
      purchaseDate
      products
      stripePaymentIntentId
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($itemId: ID!, $input: ProductInput) {
    updateProduct(itemId: $itemId, input: $input) {
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
      reviews {
        _id
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation updateReview(
    $itemId: ID!
    $reviewId: ID!
    $text: String
    $rating: Int
  ) {
    updateReview(
      itemId: $itemId
      reviewId: $reviewId
      text: $text
      rating: $rating
    ) {
      _id
      text
      author
      rating
      createdAt
    }
  }
`;

export const UPDATE_STOCK = gql`
  mutation updateStock($itemId: ID, $quantity: Int) {
    updateStock(itemId: $itemId, quantity: $quantity) {
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

export const ADD_PRODUCT = gql`
  mutation addProduct($input: ProductInput) {
    addProduct(input: $input) {
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
      reviews {
        _id
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($token: String, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

export const COMPLETE_ORDER = gql`
  mutation completeOrder(
    $orderId: ID!
    $carrier: String
    $trackingNum: String
    $fulfilled: Boolean
    $email: String
  ) {
    completeOrder(
      orderId: $orderId
      carrier: $carrier
      trackingNum: $trackingNum
      fulfilled: $fulfilled
      email: $email
    ) {
      products {
        quantity
        product {
          name
        }
      }
      address
      carrier
      customerName
      email
      fulfilled
      price
      purchaseDate
      stripePaymentIntentId
      trackingNum
      _id
    }
  }
`;
