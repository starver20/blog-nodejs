const blog = require("../models/blog");
const Blog = require("../models/blog");
const User = require("../models/user");

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

  blog
    .save()
    .then((result) => {
      User.findById(req.userId).then((user) => {
        user.blogs.push(blog);
        return user.save();
      });
    })
    .then((result) => {
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

exports.updateBlog = (req, res, next) => {
  const blogId = req.params.blogId;

  const title = req.body.title;
  const content = req.body.content;

  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        const err = new Error("Blog not found");
        err.statusCode = 404;
        throw err;
      }
      if (blog.creator.toString() !== req.userId.toString()) {
        const err = new Error(
          "not authorized, since not the creator of the post"
        );
        err.statusCode = 401;
        throw err;
      }
      blog.title = title;
      blog.content = content;

      return blog.save();
    })
    .then((updatedBlog) => {
      res.json({ message: "Updated successfully", blog: updatedBlog });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteBlog = (req, res, next) => {
  const blogId = req.params.blogId;

  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        const err = new Error("Blog not found");
        err.statusCode = 404;
        throw err;
      }
      if (blog.creator.toString() !== req.userId.toString()) {
        const err = new Error(
          "Not authorized to delete this blog...since not the creator"
        );
        err.statusCode = 501;
        throw err;
      }
      return Blog.findByIdAndRemove(blogId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.blogs.pull(blogId);
      return user.save();
    })
    .then((user) => {
      res.json({ message: "deleted successfully" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
