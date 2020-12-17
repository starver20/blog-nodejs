const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcryt = require("bcrypt");
const user = require("../models/user");

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body);

  bcryt
    .hash(password, 10)
    .then((hashedpw) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedpw,
      });

      return user.save();
    })
    .then((user) => {
      res.json({ message: "signedup successfully", userId: user._id });
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body);

  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcryt.compare(password, user.password);
    })
    .then((match) => {
      if (!match) {
        const err = new Error("Passwords dont match");
        err.statusCode = 401;
        throw err;
      }
      const token = jwt.sign(
        { userId: loadedUser._id.toString(), email: loadedUser.email },
        "secret",
        {
          expiresIn: "1h",
        }
      );
      res.json({
        message: "loggedin",
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
