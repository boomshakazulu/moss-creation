const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_JWT;
const expiration = "24h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return { req };
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      const user = data;
      return { req, user };
    } catch (err) {
      console.error("Invalid token", err);
      throw new AuthenticationError("Invalid token");
    }
  },
  signToken: function ({ username, email, id, role }) {
    const payload = { username, email, id, role };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
