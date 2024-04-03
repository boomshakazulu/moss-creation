require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const cors = require("cors");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const MY_DOMAIN = `http://localhost:3000`;
const app = express();
app.use(cors());
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve up static assets
  app.use("/images", express.static(path.join(__dirname, "../client/images")));

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  app.post("/create-checkout-session", async (req, res) => {
    const { line_items } = req.body;
    console.log("line items", line_items);
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: line_items,
        mode: "payment",
        return_url: `${MY_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      });
      console.log("sessiontoken ", session);
      res.send({ clientSecret: session.client_secret });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      res
        .status(500)
        .json({ error: "An error occurred while processing your request" });
    }
  });

  app.get("/session-status", async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    res.send({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
