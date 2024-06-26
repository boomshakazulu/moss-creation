const typeDefs = `

  type Product {
    _id: ID
    name: String!
    description: String
    price: Float!
    priceId: String
    stripeProductId: String
    photo: [String]
    stock: Int
    video: String
    reviews:[Review]
    carousel: String
    averageRating: Float
    totalRatings: Int
  }

  type Order {
    _id: ID
    purchaseDate: String
    products: [OrderProduct]
    stripePaymentIntentId: String
    address: String
    price: Float
    trackingNum: String
    fulfilled: Boolean
    email: String
    customerName: String
    carrier: String
  }

  type OrderProduct {
    product: Product
    quantity: Int
  }

  type Review {
    _id: ID
    text: String
    author: String
    itemId: Product
    rating: Int
    createdAt: String
  }

  type User {
    _id: ID
    username: String
    email: String
    role: String
    resetToken: String
    reviews: [Review]
    orders: [Order]
  }

  type Auth {
    token: ID
    user: User
  }

  type Checkout {
    session: ID
  }

  type Query {
    users: [User]
    user: User
    me: User
    products(name: String): [Product]
    reviews(itemId: ID!): [Review]
    review(reviewId: ID!): Review
    product(itemId: String): Product
    order(_id: ID!): Order
    orders:[Order]
    checkout(products: [ID]!): Checkout
    checkEmailUniqueness(email: String!): Boolean!
    checkUsernameUniqueness(username: String!): Boolean!
  }

  input ProductInput {
    name: String
    description: String
    price: Float
    priceId: String
    stripeProductId: String
    photo: [String]
    stock: Int
    video: String
    carousel: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    addProduct(input: ProductInput): Product
    addOrder(products: [ID]! stripePaymentIntentId: String, price: Float, address: String, trackingNum: String, name: String, email: String, customerName: String): Order
    updateOrder(orderId: ID!, stripePaymentIntentId: String, price: Float, address: String, trackingNum: String fulfilled: Boolean): Order
    updateProduct(itemId: ID!, input: ProductInput): Product
    updateStock(itemId: ID, quantity: Int): Product
    updateReview(itemId: ID! reviewId: ID!, text: String, rating: Int):Review
    completeOrder(orderId: ID!, carrier: String, trackingNum: String, fulfilled: Boolean, email: String): Order
    login(email: String!, password: String!): Auth
    addReview(text: String, itemId: ID!, rating: Int): Review
    forgotPassword(email: String!): String 
    resetPassword(token: String!, newPassword: String!): String
  }
`;
module.exports = typeDefs;
