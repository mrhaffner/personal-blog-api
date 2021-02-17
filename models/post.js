const mongoose = require('mongoose')

const Schema = mongoose.Schema

//preview ?
//images ?

const PostSchema = new Schema({
    title: { type: String, required: true, maxlength: 40, unique: true },
    subTitle: { type: String, required: true, maxlength: 60 },
    text: { type: String, required: true, maxlength: 150 },
    date: { type: Date, required: true, default: Date.now() },
    isPublished: { type: Boolean, default: false }
})

module.exports = mongoose.model('Post', PostSchema);