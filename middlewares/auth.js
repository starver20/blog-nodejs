const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("reached here");
  console.log(req.body);
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("No token found");
    err.statusCode = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  let auth;
  try {
    auth = jwt.verify(token, "secret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!auth) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    throw err;
  }
  req.userId = auth.userId;
  next();
};
