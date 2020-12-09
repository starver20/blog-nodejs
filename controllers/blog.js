const Blog = require("../models/blog");

exports.getBlogs = (req, res, next) => {
  Blog.find().then((blogs) => {
    console.log(blogs);
    if (blogs === []) {
      return res.json({ messaage: "No blogs found", blogs: blogs });
    }
    res.json({ message: "hi there", blogs: blogs });
  });
};

exports.createBlog = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const blog = new Blog({
    title: title,
    content: content,
    creator: req.userId,
    likes: 8,
    views: 7,
  });
  blog.save().then((result) => {
    res.json({ message: "post created", blogs: blog });
  });
};

exports.getBlog = (req, res, next) => {
  const blogId = req.params.blogId;

  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        const err = new Error("blog not found");
        err.statusCode = 404;
        throw err;
      }
      res.json({ message: "Blog found", blog: blog });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
