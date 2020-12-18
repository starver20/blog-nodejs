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
    total: {
      type: Number,
    },
    users: {
      type: Array,
      ref: "user",
    },
  },

  views: {
    total: {
      type: Number,
    },
    users: {
      type: Array,
      ref: "user",
    },
  },
});

module.exports = mongoose.model("Blog", blogSchema);
