const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { transformBooking, transformEvent } = require("./transformers");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(transformBooking);
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
    return transformBooking(result);
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.findByIdAndDelete(args.bookingId);
      return event;
    } catch (err) {
      throw err;
    }
  },
};
