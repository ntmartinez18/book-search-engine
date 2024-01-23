// created typeDefs nased on user-controller and User.js file
const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }
  
  type Book {
    bookId: ID
    title: String
    author: String
    description: String
    image: String
    link: String
  }
  
  type Auth {
    token: ID!
    user: User
  }
  
  input BookInput {
    bookId: ID
    title: String
    author: String
    description: String
    image: String
    link: String
  }
  
  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Query {
    getSingleUser(username: String!): User
  }
  
  type Mutation {
    createUser(input: CreateUserInput!): Auth
    login(username: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    deleteBook(bookId: ID!): User
  }
`;
  module.exports = typeDefs
