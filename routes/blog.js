const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();

const blogController = require("../controllers/blog");

router.get("/", (req, res, next) => {
  res.json("hi there");
});

router.get("/blogs", blogController.getBlogs);

router.post("/blog", auth, blogController.createBlog);

router.get("/blog/:blogId", blogController.getBlog);

module.exports = router;
