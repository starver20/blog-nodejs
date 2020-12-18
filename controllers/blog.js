const blog = require("../models/blog");
const Blog = require("../models/blog");
const User = require("../models/user");

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) {
      const err = new Error("blogs not found");
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({
      message: "blogs found",
      blogs: blogs,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

exports.createBlog = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const like = {
    total: 0,
    users: [],
  };
  const view = {
    total: 0,
    users: [],
  };

  const blog = new Blog({
    title: title,
    content: content,
    creator: req.userId,
    likes: like,
    views: view,
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

exports.getBlog = async (req, res, next) => {
  const blogId = req.params.blogId;
  try {
    const blog = await Blog.findById(blogId).populate("creator");

    if (!blog) {
      const err = new Error("blog not found");
      err.statusCode = 404;
      throw err;
    }

    const user = await blog.views.users.every((id) => id !== req.userId);

    if (!user) {
      return res.json(blog);
    } else {
      blog.views.total = blog.views.total + 1;
      blog.views.users.push(req.userId);
      const blogData = await blog.save();

      res.json(blogData);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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

exports.like = async (req, res, next) => {
  const blogId = req.params.blogId;
  try {
    const blog = await Blog.findById({ _id: blogId });
    if (!blog) {
      const err = new Error("Blog not found");
      err.statusCode = 404;
      throw err;
    }

    const user = await blog.likes.users.every(
      (id) => id.toString() !== req.userId.toString()
    );

    if (user) {
      console.log(user);
      blog.likes.total = blog.likes.total + 1;
      blog.likes.users.push(req.userId);

      const data = await blog.save();

      res.status(200).json({ message: "liked" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
