const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
// mongoose.Promise = require('b')

const Event = require("./models/event");

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  "/graphqlApi",
  graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation { 
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((res) => {
            console.log(res);
            return res;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        return event;
      },
    },
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
