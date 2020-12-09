const express = require("express");

const app = express();

let count = 0;
app.use("/", (req, res, next) => {
  count += 1;
  console.log(count);
  res.send(`visitor no ${count}`);
});

app.listen(3000);
