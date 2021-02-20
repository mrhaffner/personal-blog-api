// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const postRouter = require('./routes/posts');

// const app = express();

// const mongoose = require('mongoose');
// const mongoDB = process.env.DB_URI;
// mongoose.connect(mongoDB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });
// const db = mongoose.connection;
// db.on(
//   'error',
//   console.error.bind(console, 'MongoDB connection error:'),
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors());

// app.use('/blogs', postRouter);

// app.listen(3001);

// module.exports = app;

const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', postRouter);
app.use('/api/login', authRouter);
app.use('/api/user', userRouter);

// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing');
//   app.use('/api/testing', testingRouter);
// }

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
