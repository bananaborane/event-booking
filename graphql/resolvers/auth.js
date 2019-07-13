const { buildSchema } = require("graphql");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require('jsonwebtoken')



module.exports = {
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
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user){
            throw new Error('User does not exist')
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual){
            throw new Error('Passowrd is incorrect!')
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesecretkey', {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
  };



