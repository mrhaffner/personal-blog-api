const Post = require('../models/post');

exports.list_published_post = (req, res, next) => {
  Post.find({ isPublished: true }).exec((err, post_list) => {
    if (err) return next(err);
    res.json(post_list);
  });
};

exports.list_unpublished_post = (req, res, next) => {
  Post.find({ isPublished: false }).exec((err, post_list) => {
    if (err) return next(err);
    res.json(post_list);
  });
};

exports.list_post = (req, res, next) => {
  Post.find({}).exec((err, post_list) => {
    if (err) return next(err);
    res.json(post_list);
  });
};

// how to make this work pnly if authed for unpublished posts?
//change ID to slug
exports.display_post = (req, res, next) => {
  Post.findById(req.params.postId).exec((err, post) => {
    if (err) {
      return next(err);
    } else if (post == null) {
      let err = new Error('No Such Post');
      err.status = 404;
      return next(err);
    }
    res.json(post);
  });
};

// exports.create_post = (req, res, next) => {
//   const post = new Post({
//     title: req.body.title,
//     subTitle: req.body.subTitle,
//     text: req.body.text,
//   }).save((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.sendStatus(201);
//   });
// };

exports.create_post = async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    subTitle: req.body.subTitle,
    text: req.body.text,
  });
  const savedPost = await post.save();
  res.json(savedPost);
};

//change ID to slug
exports.update_post = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    _id: req.params.postId,
  });
  Post.findByIdAndUpdate(req.params.postId, post, {}, (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(201);
  });
};

//change ID to slug
exports.publish_post = (req, res, next) => {
  const post = new Post({
    isPublished: req.body.isPublished,
    publishedDate: Date.now(),
    _id: req.params.postId,
  });
  Post.findByIdAndUpdate(req.params.postId, post, {}, (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(201);
  });
};

//change ID to slug
exports.delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.params.postId, (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};
