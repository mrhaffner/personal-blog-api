const Post = require('../models/post');
const jwt = require('jsonwebtoken');

exports.list_published_post = async (req, res, next) => {
  const posts = await Post.find({ isPublished: true });
  const sortedPosts = posts.sort((a, b) => {
    let c = new Date(a.publishedDate);
    let d = new Date(b.publishedDate);
    return d - c;
  });
  res.json(sortedPosts);
};

exports.list_unpublished_post = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }

  const posts = await Post.find({ isPublished: false });
  const sortedPosts = posts.sort((a, b) => {
    let c = new Date(a.date);
    let d = new Date(b.date);
    return d - c;
  });
  res.json(sortedPosts);
};

exports.list_post = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }

  const posts = await Post.find({});
  const sortedPosts = posts.sort((a, b) => {
    let c = new Date(a.date);
    let d = new Date(b.date);
    return d - c;
  });
  res.json(sortedPosts);
};

// how to make this work pnly if authed for unpublished posts?
//change ID to slug
//probably don't need this
// exports.display_post = (req, res, next) => {
//   Post.findById(req.params.postId).exec((err, post) => {
//     if (err) {
//       return next(err);
//     } else if (post == null) {
//       let err = new Error('No Such Post');
//       err.status = 404;
//       return next(err);
//     }
//     res.json(post);
//   });
// };

//add error handling
exports.create_post = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }
  const postCheck = await Post.findOne({ title: req.body.title });

  if (postCheck) {
    return res.status(400).json({ error: 'title already in use!' });
  }

  const post = new Post({
    title: req.body.title,
    subTitle: req.body.subTitle,
    text: req.body.text,
  });
  const savedPost = await post.save();
  res.json(savedPost);
};

//add error handling
exports.update_post = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }

  const postCheck = await Post.findOne({ title: req.body.title });
  if (
    postCheck &&
    postCheck._id.toString() !== req.params.postId.toString()
  ) {
    return res.status(400).json({ error: 'title already in use!' });
  }

  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    subTitle: req.body.subTitle,
    _id: req.params.postId,
    isPublished: req.body.isPublished,
  });
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    post,
    { new: true },
  );
  res.json(updatedPost);
};

exports.publish_post = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }
  const post = new Post({
    isPublished: req.body.isPublished,
    publishedDate: Date.now(),
    _id: req.params.postId,
  });
  await Post.findByIdAndUpdate(req.params.postId, post, {});
  res.sendStatus(201).end();
};

exports.delete_post = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'token missing or invalid' });
  }
  await Post.findByIdAndRemove(req.params.postId);
  res.status(204).end();
};
