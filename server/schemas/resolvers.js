const { User, Product, Review, Order } = require("../models");
const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const resolvers = {
  Query: {
    products: async (parent) => {
      return await Product.find();
    },
    product: async (parent, { itemId }) => {
      try {
        return await Product.findById(itemId);
      } catch (err) {
        throw new Error("Failed to fetch product");
      }
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: "orders.products",
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw AuthenticationError;
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: "orders.products",
        });

        return user.orders.id(_id);
      }

      throw AuthenticationError;
    },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ products: args.products });
      const line_items = [];

      const { products } = await order.populate("products");

      for (let i = 0; i < products.length; i++) {
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/${products[i].image}`],
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: products[i].price * 100,
          currency: "usd",
        });

        line_items.push({
          price: price.id,
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, {
          $push: { orders: order },
        });

        return order;
      }

      throw AuthenticationError;
    },
    addProduct: async (parent, { input }, context) => {
      if (context.user && context.user.role === "admin") {
        try {
          // Step 1: Save product details in MongoDB
          const newProduct = await Product.create(input);

          // Step 2: Create product in Stripe
          const stripeProduct = await stripe.products.create({
            name: input.name,
            description: input.description,
            // Add other product details as needed
          });

          // Step 3: Update MongoDB with Stripe Product ID
          newProduct.stripeProductId = stripeProduct.id;
          await newProduct.save();

          // If price is included in the input, create price in Stripe
          if (input.price) {
            // Step 4: Create price in Stripe
            const stripePrice = await stripe.prices.create({
              product: stripeProduct.id,
              unit_amount: input.price * 100, // Price in cents
              currency: "usd", // Change currency as needed
              // Add other price details as needed
            });

            // Step 5: Update MongoDB with Stripe Price ID
            newProduct.priceId = stripePrice.id;
            await newProduct.save();
          }

          return newProduct;
        } catch (error) {
          // Handle errors
          console.error("Error creating product:", error);
          throw new Error("Failed to create product");
        }
      } else {
        throw new AuthenticationError("Unauthorized");
      }
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }

      throw new AuthenticationError("You must be an admin to add a product.");
    },
    updateProduct: async (parent, { itemId, input }, context) => {
      if (context.user && context.user.role === "admin") {
        try {
          // Step 1: Update product details in MongoDB
          const updatedProduct = await Product.findByIdAndUpdate(
            itemId,
            input,
            {
              new: true,
            }
          );

          // Step 2: Check if the updated fields include name, description, or price
          if (input.name || input.description || input.price) {
            // Step 3: If any of these fields are updated, update corresponding details in Stripe
            const stripeProduct = await stripe.products.update(
              updatedProduct.stripeProductId, // Use the stripeProductId saved in MongoDB
              {
                name: input.name,
                description: input.description,
                // Update other product details as needed
              }
            );

            // Step 4: Update MongoDB with updated Stripe Product ID
            updatedProduct.stripeProductId = stripeProduct.id;
          }

          // Step 5: If price is updated, create a new price in Stripe and update MongoDB
          if (input.price) {
            // Retrieve the existing price details from Stripe
            const existingPrice = await stripe.prices.retrieve(
              updatedProduct.priceId
            );

            // Deactivate the existing price
            await stripe.prices.update(updatedProduct.priceId, {
              active: false,
            });

            // Create a new price with the updated amount
            const newPrice = await stripe.prices.create({
              product: updatedProduct.stripeProductId,
              unit_amount: input.price * 100, // Price in cents
              currency: "usd", // Change currency as needed
              // Add other price details as needed
            });

            // Update MongoDB with the ID of the new price
            updatedProduct.priceId = newPrice.id;
          }

          // Step 6: Save the updated product details in MongoDB
          await updatedProduct.save();

          return updatedProduct;
        } catch (error) {
          // Handle errors
          console.error("Error updating product:", error);
          throw new Error("Failed to update product");
        }
      } else {
        // If the user doesn't have the 'admin' role, throw an error
        throw new Error("Unauthorized: Only admin users can update products");
      }
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
      return { token, user };
    },
    addReview: async (parent, { text, itemId }, context) => {
      if (context.user) {
        const review = await Review.create({
          text,
          author: context.user.username,
          itemId,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { reviews: review._id },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        await Product.findByIdAndUpdate(
          itemId,
          {
            $addToSet: { reviews: review._id },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return review;
      }
      throw AuthenticationError;
    },
    updateOrder: async (_, { orderId, stripePaymentIntentId }) => {
      try {
        const order = await Order.findByIdAndUpdate(
          orderId,
          { $set: { stripePaymentIntentId } },
          { new: true }
        );

        return order;
      } catch (error) {
        console.error("Error updating order:", error.message);
        throw new Error("Unable to update order.");
      }
    },
  },
};

module.exports = resolvers;
