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
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id });
        }
        throw AuthenticationError;
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            try {
              const user = await User.create({ username, email, password });
              if (!user) {
                throw new Error('Something went wrong. User could not be created.');
              }
              const token = signToken(user);
              return { token, user };
            } catch (err) {
              console.error(err);
              throw new Error('Server error. User could not be created.');
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
      
            const token = signToken(user);
            return { token, user };
          },
    },
};

module.exports = resolvers