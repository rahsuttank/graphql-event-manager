const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const graphQLSchema = require("./graphql/schema/index");

const resolvers = require("./graphql/resolver/index");

const isAuth = require("./middleware/is-auth");

const app = express();

// app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphqlApi",
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: resolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://
${process.env.MONGO_USER}:
${process.env.MONGO_PASSWORD}
@cluster0.cxlsy.mongodb.net/
${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("connected to mongoDB");
  });

app.listen(3000);
