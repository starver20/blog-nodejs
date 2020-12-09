const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

app.use(blogRoutes);
app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
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
