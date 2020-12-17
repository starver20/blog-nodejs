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

router.put("/blog/:blogId", auth, blogController.updateBlog);

router.delete("/blog/:blogId", auth, blogController.deleteBlog);

module.exports = router;
//ek min
