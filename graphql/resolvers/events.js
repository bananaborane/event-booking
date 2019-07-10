const Event = require("../../models/event");
const { dateToString } = require('../../helpers/date')
const { transformEvent } = require('./merge')


const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator) // binds and invokes user function from below
    }
}

module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return transformEvent(event);
        });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async (args) => {
      // const event = {
      //     _id: Math.random().toString(),
      //     title: args.eventInput.title,
      //     description: args.eventInput.description,
      //     price: +args.eventInput.price,
      //     date: args.eventInput.date
      // }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date), // creates a new date obj
        creator: "IDSTRINGHERE"
      });
      let createdEvent;
      try {
      const result = await event
        .save()
          createdEvent = transformEvent(result)
          console.log(result);
          const creator = await User.findById("IDSTRINGHERE");
          if (!creator) {
            throw new Error("User not found.");
          }
          creator.createdEvents.push(event);
          await creator.save();
        
          return createdEvent;
  
      } catch(err) {
          throw err;
      }
  
      return event;
    }
  };
  