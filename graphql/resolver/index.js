const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const events = async (eventIds) => {
  try {
    const eventsArray = await Event.find({ _id: { $in: eventIds } });
    return eventsArray.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      creator: user.bind(this, event._doc.user),
    };
  } catch (err) {
    throw err;
  }
};

const user = async (userID) => {
  try {
    const userQuery = await User.findById(userID);
    return {
      ...userQuery._doc,
      createdEvents: events.bind(this, userQuery._doc.createdEvents),
    };
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
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
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
      return { ...res._doc, date: new Date(event._doc.date).toISOString() };
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
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "67ac08d541265d2c4717e472",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      // user: user.bind(this, "67ac08d541265d2c4717e472"),
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      console.log(booking);
      
      const event = {
        ...booking.event._doc,
        creator: user.bind(this, booking.event._doc.creator),
      };
      await Booking.findByIdAndDelete(args.bookingId);
      return event; 
    } catch (err) {
      throw err;
    }
  },
};
