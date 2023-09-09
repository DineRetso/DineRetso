const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      isOwner: user.isOwner,
    },
    "" + process.env.SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const generateAdminToken = (dine) => {
  return jwt.sign(
    {
      _id: dine._id,
      name: dine.lName,
      email: dine.email,
      isAdmin: dine.isAdmin,
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
const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No token!" });
  }
};

const isAdminAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.dine = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No token!" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.dine && req.dine.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid admin token!" });
  }
};
const isOwner = (req, res, next) => {
  if (req.user && req.user.isOwner) {
    next();
  } else {
    res.status(401).send({ message: "Invalid owner token!" });
  }
};

module.exports = {
  generateToken,
  generateResetToken,
  generateAdminToken,
  isAuth,
  isAdminAuth,
  isAdmin,
  isOwner,
};
