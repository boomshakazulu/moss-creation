const { User, Item, Review } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("reviews");
      }

      throw new AuthenticationError("User not authenticated");
    },
    users: async () => {
      return User.find().populate("reviews");
    },

    user: async (parent, { username }) => {
      return User.findOne({ username: username });
    },

    items: async () => {
      return Item.find();
    },

    item: async (parent, { itemID }) => {
      const params = itemID ? { itemID } : {};
      return Item.findById(params).populate("reviews");
    },

    reviews: async (parent, { itemID }) => {
      const params = itemID ? { itemID } : {};
      return Review.find(params)
        .sort({ createdAt: 1 })
        .select("_id text author itemID createdAt");
    },

    review: async (parent, { reviewId }) => {
      return Review.findOne({ _id: reviewId });
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }

      throw AuthenticationError;
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

      const token = signToken(user);

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
        return comment;
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
