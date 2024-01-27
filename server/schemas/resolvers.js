const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find({});
        },
        books: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            return Book.find(params);
        },
    },
    me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id });
        }
        throw AuthenticationError;
    },
    Mutation: {
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
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
      
            return { token, user };
          },
        // addUser: async (parent, { username, email, password }) => {
        //     try {
        //       const user = await User.create({ username, email, password });
        //       if (!user) {
        //         throw new Error('Something went wrong. User could not be created.');
        //       }
        //       const token = signToken(user);
        //       return { token, user };
        //     } catch (err) {
        //       console.error(err);
        //       throw new Error('Server error. User could not be created.');
        //     }
        //   },
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
              const user = await User.findByIdAndUpdate(
                context.user._id,
                { $push: { savedBooks: input } },
                { new: true }
              );
      
              return user;
            }
      
            throw new Error('You need to be logged in to perform this action');
          },
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const user = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
      
              return user;
            }
      
            throw new Error('You need to be logged in to perform this action');
          },
        },
      };

module.exports = resolvers