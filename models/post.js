const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 40,
    unique: true,
  },
  subTitle: { type: String, required: true, maxlength: 60 },
  text: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now() },
  publishedDate: { type: Date },
  isPublished: { type: Boolean, default: false },
  slug: { type: String, required: true, unique: true },
});

PostSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

class Post {
  static getAllPosts() {
    return this.find({});
  }

  static getPublishedPosts() {
    return this.find({ isPublished: true });
  }

  static getUnpublishedPosts() {
    return this.find({ isPublished: false });
  }

  static getPostByTitle(title) {
    return this.findOne({ title });
  }

  static addPost(postInfo) {
    const post = this(postInfo);
    return post.save();
  }

  static updatePost(postInfo) {
    const post = this(postInfo);
    return this.findByIdAndUpdate(postInfo._id, post, {
      new: true,
    });
  }

  static publishPost(postInfo) {
    const post = this({ ...postInfo, publishedDate: Date.now() });
    this.findByIdAndUpdate(post._id, post, {});
  }

  static deletePost(id) {
    this.findByIdAndRemove(id);
  }
}

PostSchema.loadClass(Post);

module.exports = mongoose.model('Post', PostSchema);
