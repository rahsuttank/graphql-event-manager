const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const events = async (eventIds) => {
  try {
    const eventsArray = await Event.find({ _id: { $in: eventIds } });
    return eventsArray.map((event) => {
      return {
        ...event._doc,
        creator: user.bind(this,event._doc.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const user = async (userID) => {
  try {
    const userQuery = await User.findById(userID);
    return {
      ...userQuery._doc,
      createdEvents: events.bind(this, userQuery._doc.createdEvents)
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(async (event) => {
          return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator),
          };
        });
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
  }