const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use(cors());

const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

app.use(blogRoutes);
app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, data: data });
});
mongoose
  .connect(
    "mongodb+srv://NewAmar:OfuAR4iKLMjZsQan@newamar.9xxre.mongodb.net/blog?"
  )
  .then((result) => {
    console.log("connected to database");
    return app.listen(4000);
  })
  .then((result) => {
    console.log("connected to 4000");
  });
/**
 * bhej requesti  abe ye try kiya maine...data record ho raha hai...fir bhi dikhata hu
 */
