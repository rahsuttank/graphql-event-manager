const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./transformers");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(transformEvent);
    } catch (err) {
      console.log(err);
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unathenticated");
    }
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title: title,
      description: description,
      price: +price,
      date: new Date(date),
      creator: req.userId,
    });
    try {
      const res = await event.save();
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("No user by that ID");
      }
      user.createdEvents.push(event);
      await user.save();
      return transformEvent(res);
    } catch (err) {
      console.log(err);
      throw new Error(`Error: ${err}`);
    }
  },
};
