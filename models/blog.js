const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
