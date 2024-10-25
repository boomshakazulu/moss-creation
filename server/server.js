require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const cors = require("cors");
const mongoose = require("mongoose");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const PORT = process.env.PORT || 3001;
const MY_DOMAIN = `https://www.mossy-creations.com`;
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
  app.use((req, res, next) => {
    if (req.originalUrl === "/webhook") {
      next(); // Do nothing with the body because I need it in a raw state.
    } else {
      express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
    }
  });

  // Serve up static assets
  app.use("/images", express.static(path.join(__dirname, "../client/images")));

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  app.post("/create-checkout-session", async (req, res) => {
    const { line_items, metadata } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: line_items,
        shipping_address_collection: {
          allowed_countries: ["US", "CA"],
        },
        mode: "payment",
        return_url: `${MY_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
        payment_intent_data: {
          metadata: {
            products: metadata.products,
            customerEmail: metadata.customerEmail,
            userId: metadata.userId,
          },
        },
      });
      res.send({ clientSecret: session.client_secret });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      res
        .status(500)
        .json({ error: "An error occurred while processing your request" });
    }
  });

  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        console.error(err.message);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntentId = event.data.object.id.toString();
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );
          const eventData = event.data.object;
          const metadata = eventData.metadata || {};
          const products = JSON.parse(metadata.products || "[]");
          const userId = metadata.userId;
          const cart = metadata.cart;
          const shipInfo = paymentIntent.shipping.address;
          const address = `${shipInfo.line1} ${
            shipInfo.line2 ? shipInfo.line2 : ""
          },
            ${shipInfo.city},
            ${shipInfo.state},
            ${shipInfo.postal_code}`;
          const price = paymentIntent.amount / 100;
          const name = paymentIntent.name;
          const customerEmail = metadata.customerEmail;
          const customerName = paymentIntent.shipping.name;

          // Handle the successful payment intent, e.g., create an order in the database
          try {
            console.log(metadata);
            const mappedProducts = products.map((product) => ({
              product: mongoose.Types.ObjectId.createFromHexString(
                product.productId
              ),
              quantity: product.quantity,
            }));
            console.log(mappedProducts);
            // Use the extracted products to create the order
            const order = await resolvers.Mutation.addOrder(
              null,
              {
                products: mappedProducts,
                paymentIntentId,
                userId,
                address,
                price,
                name,
                customerEmail,
                customerName,
              },
              null
            );
            console.log("Order created:", order);
            res.status(200).json({ success: true });
          } catch (error) {
            console.error("Error creating order:", error);
          }
          break;
        // Add other event types you want to handle
        default:
          console.log("Unhandled event type:", event.type);
      }
    }
  );

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
