const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    reviews: [Review]
  }

type Item {
  _id: ID
  name: String!
  description: String
  price: Float!
  photo: String
  stock: Int!
  video: String
  reviews:[Review]
}

  type Review {
    _id: ID
    text: String
    author: String
    itemId: String!
    createdAt: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    reviews(itemId: String): [Review]
    review(commentId: ID!): Review
    me: User
    items: [Item]
    item(itemID: String):Item
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    addReview(text: String, itemId: String): Review
  }
`;
module.exports = typeDefs;
