require('dotenv').config();

const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/posts');

const app = express();

const mongoose = require('mongoose');
const mongoDB = process.env.DB_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:'),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/blogs', postRouter);

app.listen(3001);

module.exports = app;
