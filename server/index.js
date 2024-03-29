const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
      type User{
        id:ID
        name:String!
        email:String!
        address:String!
        phone:String!
        website:String!
      } 
      type Todo{
        id: ID!
        title: String!
        completed: Boolean!
      }
      type Query{
        getTodos: [Todo]!
        getAllUsers: [User]!
        getUser(id:ID):User!
      }
    `,
    resolvers: {
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`C/${id}`)).data,
      },
    },
  });
  app.use(bodyParser.json());
  app.use(cors());
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

startServer();
