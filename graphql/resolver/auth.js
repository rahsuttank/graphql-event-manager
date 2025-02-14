const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {
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
