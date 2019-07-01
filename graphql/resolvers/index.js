const bcrypt = require("bcryptjs");
const { buildSchema } = require("graphql");

const Event = require("../../models/event");
const User = require("../../models/user");

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

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
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator) // binds and invokes user function from up above
        };
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
        createdEvent = {
          ...result._doc,
          _id: result._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator) // binds and invokes events function from up above
        };
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
  },
  createUser: async args => {
      try {
    const existingUser = await User.findOne({
      email: args.userInput.email
    })

        if (!existingUser) {
          throw new Error("User not found.");
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);


        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        const result = awaituser.save();


        return { ...result._doc, password: null, _id: result.id };

    } catch(err) {
        throw err;
    }
  }
};
