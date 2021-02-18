const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

//preview ?
//images ?

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 40,
    unique: true,
  },
  subTitle: { type: String, required: true, maxlength: 60 },
  // make sure to set this
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

module.exports = mongoose.model('Post', PostSchema);
