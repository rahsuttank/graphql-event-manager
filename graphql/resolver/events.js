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
      return transformEvent(res);
    } catch (err) {
      console.log(err);
      throw new Error(`Error: ${err}`);
    }
  },
};
