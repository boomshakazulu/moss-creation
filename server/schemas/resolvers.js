const { User, Product, Review, Order } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

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
        return await Product.create(input);
      }
      throw AuthenticationError;
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
      // Check if the user making the request has the 'admin' role
      if (context.user && context.user.role === "admin") {
        // If the user has the 'admin' role, proceed with updating the product
        const updatedProduct = await Product.findByIdAndUpdate(itemId, input, {
          new: true,
        });
        return updatedProduct;
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
