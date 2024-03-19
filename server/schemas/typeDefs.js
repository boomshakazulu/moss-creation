const typeDefs = `

  type Product {
    _id: ID
    name: String!
    description: String
    price: Float!
    photo: [String]
    stock: Int
    video: String
    reviews:[Review]
    carousel: String
  }

  type Order {
    _id: ID
    purchaseDate: String
    products: [Product]
    stripePaymentIntentId: String
  }

  type Review {
    _id: ID
    text: String
    author: String
    itemId: String!
    createdAt: String
  }

  type User {
    _id: ID
    username: String
    email: String
    role: String
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
    products(name: String): [Product]
    reviews(itemId: String): [Review]
    review(reviewId: ID!): Review
    product(itemId: String): Product
    order(_id: ID!): Order
    checkout(products: [ID]!): Checkout
  }

  input ProductInput {
    name: String
    description: String
    price: Float
    photo: [String]
    stock: Int
    video: String
    carousel: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    addProduct(input: ProductInput): Product
    addOrder(products: [ID]!): Order
    updateOrder(orderId: ID!, stripePaymentIntentId: String): Order
    updateProduct(itemId: ID!, input: ProductInput): Product
    login(email: String!, password: String!): Auth
    addReview(text: String, itemId: String, author: String!): Review
  }
`;
module.exports = typeDefs;
