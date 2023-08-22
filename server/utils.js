const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      role: user.role,
    },
    "" + process.env.SECRET,
    {
      expiresIn: "30d",
    }
  );
};
const generateResetToken = () => {
  const secret = process.env.SECRET;
  const resetToken = jwt.sign({}, secret, { expiresIn: "1h" });
  return resetToken;
};
module.exports = { generateToken, generateResetToken };
