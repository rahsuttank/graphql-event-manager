const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new Error("Password is incorrect");
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        "somesupersecretkey",
        { expiresIn: "1h" }
      );
      return {
        userId: user._id,
        token: token,
        tokenExpiration: 1,
      };
    } catch (err) {
      throw err;
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
};
