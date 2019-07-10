const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge')
const Event = require('../../models/event')

const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator) // binds and invokes user function from below
    }
}

const transformBooking = (booking) => {
    return { 
        ...bookings._doc, 
        _id: booking.id, 
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
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
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bookings: async () => {
      try {
        const bookings = await Booking.find();
        return bookings.map(booking => {
            return transformBooking(result)
        })
      } catch (){
          throw err;
      }
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({
        _id: args.eventId
    });
    const booking = new Booking({
        user: 'IDSTRINGHERE',
        event: fetchedEvent
    })
    const result = await booking.save();
    return transformBooking(booking)
  },
  cancelBooking: async (args) => {
    try {
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: args.bookingId })
        return event;
    } catch (err) {
        throw err;
    }
  }
};
