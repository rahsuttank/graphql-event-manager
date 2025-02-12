const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

const events = [];

app.use(bodyParser.json());

const user = async (userID) => {
  try {
    const creatorUser = await User.findById(userID);
    return creatorUser;
  } catch (err) {
    throw err;
  }
};
// user("67ac08d541265d2c4717e472").then(res => console.log("sss",res));

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
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation { 
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `),
    rootValue: {
      events: async () => {
        try {
          const eventsQuery = await Event.find();
          const events = eventsQuery.map(async (event) => {
            return {
              ...event._doc,
              creator: user.bind(this, event._doc.creator),
            };
          });
          return events;
        } catch (err) {
          console.log(err);
        }
      },
      createEvent: async (args) => {
        const { title, description, price, date } = args.eventInput;
        const event = new Event({
          title: title,
          description: description,
          price: +price,
          date: new Date(date),
          creator: "67ac08d541265d2c4717e472",
        });
        try {
          const res = await event.save();
          const user = await User.findById("67ac08d541265d2c4717e472");
          if (!user) {
            throw new Error("No user by that ID");
          }
          user.createdEvents.push(event);
          await user.save();
          return res;
        } catch (err) {
          console.log(err);
          throw new Error(`Error: ${err}`);
        }
      },
      createUser: async (args) => {
        const { email, password } = args.userInput;
        try {
          const emailTaken = await User.findOne({ email: email });
          if (emailTaken) {
            throw new Error("Email already taken");
          }
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = new User({
            email: email,
            password: hashedPassword,
          });
          const result = await user.save();
          console.log(result);
          return result;
        } catch (err) {
          throw err;
        }
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
