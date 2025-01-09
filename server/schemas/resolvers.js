const { User, Product, Review, Order } = require("../models");
const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const {
  passResetEmail,
  passResetSuccessEmail,
  trackingNumberEmail,
} = require("../utils/nodemailer");

const { UrlEncode, UrlDecode } = require("../utils/helper");

const resolvers = {
  Query: {
    products: async (parent) => {
      return await Product.find();
    },
    product: async (parent, { itemId }) => {
      try {
        return await Product.findById(itemId).populate("reviews");
      } catch (err) {
        throw new Error("Failed to fetch product");
      }
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user.id)
          .populate({
            path: "orders",
            populate: {
              path: "products.product",
              model: "Product",
            },
          })
          .populate({
            path: "reviews",
            populate: {
              path: "itemId",
              model: "Product",
            },
          });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw AuthenticationError;
    },
    user: async (parent, { _id }, context) => {
      try {
        const user = await User.findById(_id);
        return user;
      } catch (err) {
        throw new Error("Failed to fetch user");
      }
    },
    reviews: async (parent, { itemId }, context) => {
      try {
        return await Review.find(itemId);
      } catch (err) {
        throw new Error("Failed to get reviews");
      }
    },
    checkEmailUniqueness: async (_, { email }) => {
      try {
        // Query the database to check if the email already exists
        const existingUser = await User.findOne({ email });
        return !existingUser; // Return true if email is unique, false otherwise
      } catch (error) {
        console.error("Error checking email uniqueness:", error);
        throw new Error("Failed to check email uniqueness");
      }
    },

    checkUsernameUniqueness: async (_, { username }) => {
      try {
        // Query the database to check if the username already exists
        const existingUser = await User.findOne({ username });
        return !existingUser; // Return true if username is unique, false otherwise
      } catch (error) {
        console.error("Error checking username uniqueness:", error);
        throw new Error("Failed to check username uniqueness");
      }
    },
    order: async (parent, { _id }, context) => {
      try {
        if (context.user) {
          const user = await User.findById(context.user._id).populate({
            path: "products",
            populate: {
              path: "product",
              model: "Product",
            },
          });

          return user.orders.id(_id);
        }
      } catch (err) {
        throw AuthenticationError;
      }
    },
    orders: async (parent) => {
      try {
        return await Order.find().populate({
          path: "products",
          populate: {
            path: "product",
            model: "Product",
          },
        });
      } catch (error) {
        throw new Error("Failed to fetch orders");
      }
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
    addOrder: async (
      parent,
      {
        products,
        paymentIntentId,
        userId,
        address,
        price,
        name,
        customerEmail,
        customerName,
      },
      context
    ) => {
      try {
        const mappedProducts = products.map(({ product, quantity }) => ({
          product,
          quantity,
        }));

        // Create a new order instance with the provided information
        const order = new Order({
          products: mappedProducts,
          stripePaymentIntentId: paymentIntentId,
          purchaseDate: new Date(),
          address,
          price,
          name,
          email: customerEmail,
          customerName,
        });

        // Save the order to the database
        const savedOrder = await order.save();

        // Associate the order with the user who made the purchase
        await User.findByIdAndUpdate(userId, {
          $push: { orders: savedOrder._id },
        });

        return savedOrder;
      } catch (error) {
        console.error("Error adding order:", error);
        throw new Error("Failed to add order");
      }
    },
    completeOrder: async (
      parent,
      { orderId, carrier, trackingNum, fulfilled, email },
      context
    ) => {
      if (context.user && context.user.role === "admin") {
        try {
          const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
              carrier: carrier,
              trackingNum: trackingNum,
              fulfilled: fulfilled,
            },
            { new: true }
          ).populate({
            path: "products",
            populate: {
              path: "product",
              model: "Product",
            },
          });
          if (fulfilled) {
            await trackingNumberEmail(carrier, trackingNum, email);
          }
          return updatedOrder;
        } catch (err) {
          console.error("Error fulfilling order", err);
          throw new Error("Failed to fulfill order");
        }
      } else {
        throw new AuthenticationError("Unauthorized");
      }
    },
    addProduct: async (parent, { input }, context) => {
      if (context.user && context.user.role === "admin") {
        try {
          //Save product details in MongoDB
          const newProduct = await Product.create(input);

          //Create product in Stripe
          const stripeProduct = await stripe.products.create({
            name: input.name,
            description: input.description
              .replace(/<\/?[^>]+(>|$)/g, " ")
              .replace(/\s+/g, " ")
              .trim(),
            // Add other product details as needed
          });

          //Update MongoDB with Stripe Product ID
          newProduct.stripeProductId = stripeProduct.id;
          await newProduct.save();

          // If price is included in the input, create price in Stripe
          if (input.price) {
            //Create price in Stripe
            const stripePrice = await stripe.prices.create({
              product: stripeProduct.id,
              unit_amount: input.price * 100, // Price in cents
              currency: "usd",
            });

            //Update MongoDB with Stripe Price ID
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
          //Update product details in MongoDB
          const updatedProduct = await Product.findByIdAndUpdate(
            itemId,
            input,
            {
              new: true,
            }
          );

          //Check if the updated fields include name, description, or price
          if (input.name || input.description || input.price) {
            //If any of these fields are updated, update corresponding details in Stripe
            const stripeProduct = await stripe.products.update(
              updatedProduct.stripeProductId, // Use the stripeProductId saved in MongoDB
              {
                name: input.name,
                description: input.description
                  .replace(/<\/?[^>]+(>|$)/g, " ")
                  .replace(/\s+/g, " ")
                  .trim(),
                // Update other product details as needed
              }
            );

            //Update MongoDB with updated Stripe Product ID
            updatedProduct.stripeProductId = stripeProduct.id;
          }

          //If price is updated, create a new price in Stripe and update MongoDB
          if (input.price) {
            // Retrieve the existing price details from Stripe
            const existingPrice = await stripe.prices.retrieve(
              updatedProduct.priceId
            );
            if (existingPrice) {
              // Deactivate the existing price
              await stripe.prices.update(updatedProduct.priceId, {
                active: false,
              });
            }

            // Create a new price with the updated amount
            const newPrice = await stripe.prices.create({
              product: updatedProduct.stripeProductId,
              unit_amount: input.price * 100, // Price in cents
              currency: "usd",
            });

            //Update MongoDB with the ID of the new price
            updatedProduct.priceId = newPrice.id;
          }

          //Save the updated product details in MongoDB
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
    updateStock: async (parent, { itemId, quantity }) => {
      try {
        // Find the product by its ID
        const product = await Product.findById(itemId);

        // Calculate the new stock
        let newStock = product.stock - quantity;

        // Ensure the new stock is not negative
        if (newStock < 0) {
          newStock = 0;
        }

        // Use findByIdAndUpdate to update the stock
        await Product.findByIdAndUpdate(itemId, { stock: newStock });

        // Return the updated product
        return Product.findById(itemId);
      } catch (err) {
        console.error("Error updating stock:", err);
        throw new Error("Unable to update stock");
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
    addReview: async (parent, { text, itemId, rating }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in to add a review.");
      }

      try {
        const objectId = new ObjectId(itemId);
        const review = await Review.create({
          text,
          author: context.user.username,
          itemId: objectId,
          rating,
        });

        // Update user's reviews
        await User.findByIdAndUpdate(context.user.id, {
          $addToSet: { reviews: review._id },
        });

        // Update product's reviews and calculate new average rating
        const product = await Product.findByIdAndUpdate(
          itemId,
          { $push: { reviews: review._id } },
          { new: true }
        );

        if (!product) {
          throw new ApolloError("Product not found.");
        }

        const totalRatings = product.reviews.length;

        if (totalRatings > 0) {
          const sumRatings = await Review.aggregate([
            { $match: { _id: { $in: product.reviews } } },
            { $group: { _id: null, sum: { $sum: "$rating" } } },
          ]);

          const averageRating =
            sumRatings.length > 0
              ? Number((sumRatings[0].sum / totalRatings).toFixed(2))
              : 0;

          // Update product's rating fields
          product.averageRating = averageRating;
        } else {
          product.averageRating = 0;
        }

        product.totalRatings = totalRatings;

        await product.save();

        return review;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new UserInputError(
            "Validation failed. Please check your input."
          );
        }
        console.error("Error adding review:", error.message);
        throw new ApolloError("Unable to add review.");
      }
    },
    updateReview: async (_, { itemId, reviewId, text, rating }, context) => {
      try {
        if (!context.user) {
          throw new AuthenticationError(
            "You must be logged in to update a review."
          );
        }

        const review = await Review.findByIdAndUpdate(
          reviewId,
          { $set: { text, rating } },
          { new: true }
        );

        if (!review) {
          throw new ApolloError("Review not found.");
        }

        const product = await Product.findById(itemId);
        if (!product) {
          throw new ApolloError("Product not found.");
        }

        const totalRatings = product.reviews.length;
        const sumRatings = await Review.aggregate([
          { $match: { _id: { $in: product.reviews } } },
          { $group: { _id: null, sum: { $sum: "$rating" } } },
        ]);

        const averageRating =
          sumRatings.length > 0
            ? Number((sumRatings[0].sum / totalRatings).toFixed(2))
            : 0;

        // Update product's rating fields
        product.averageRating = averageRating;
        product.totalRatings = totalRatings;

        await product.save();

        return review;
      } catch (error) {
        console.error("Error updating review:", error.message);
        throw new ApolloError("Unable to update review.");
      }
    },
    updateOrder: async (_, { orderId, stripePaymentIntentId }, context) => {
      try {
        // Check if the user is authenticated
        if (!context.user) {
          throw new AuthenticationError(
            "You must be logged in to update an order."
          );
        }

        // Update the order with the provided stripePaymentIntentId
        const order = await Order.findByIdAndUpdate(
          orderId,
          { $set: { stripePaymentIntentId } },
          { new: true }
        );

        // If the order doesn't exist, throw an error
        if (!order) {
          throw new ApolloError("Order not found.");
        }

        // Return the updated order
        return order;
      } catch (error) {
        // Handle errors
        console.error("Error updating order:", error.message);
        throw new ApolloError("Unable to update order.");
      }
    },
    forgotPassword: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const payload = {
          userId: user._id,
          timestamp: Date.now() / 1000,
        };

        const token = jwt.sign(payload, process.env.SECRET_JWT, {
          expiresIn: "1h",
        });

        const encodedToken = UrlEncode(token);

        await User.findByIdAndUpdate(
          user.id,
          { $set: { resetToken: token } },
          { new: true }
        );

        await passResetEmail(user.email, encodedToken);

        return null;
      } catch (error) {
        console.error(error);
        throw new ApolloError("Failed to initiate password reset");
      }
    },
    resetPassword: async (_, { token, newPassword }, context) => {
      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        let user;
        if (context.user) {
          user = await User.findByIdAndUpdate(
            context.user.id,
            { $set: { password: hashedPassword } },
            { new: true }
          );
          if (!user) {
            throw new ApolloError("User not found");
          }
        } else {
          const decodedToken = UrlDecode(token);
          const decoded = jwt.verify(decodedToken, process.env.SECRET_JWT);
          user = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: { password: hashedPassword, resetToken: null } },
            { new: true }
          );
          if (!user) {
            throw new ApolloError("User not found");
          }
        }

        await passResetSuccessEmail(user.email);

        return "Password reset successfully";
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          throw new ApolloError("Token expired");
        }
        console.error(error);
        throw new ApolloError("Failed to reset password");
      }
    },
  },
};

module.exports = resolvers;
