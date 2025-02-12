const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const graphQLSchema = require('./graphql/schema/index')

const resolvers = require('./graphql/resolver/index')


const app = express();

app.use(bodyParser.json());


// user("67ac08d541265d2c4717e472").then(res => console.log("sss",res));

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
