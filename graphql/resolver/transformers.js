const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const events = async (eventIds) => {
  try {
    const eventsArray = await Event.find({ _id: { $in: eventIds } });
    return eventsArray.map(transformEvent);
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
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

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
