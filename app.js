const express = require('express');

const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const { AppError, appErrors } = require('./utils/app-error');

const app = express();

app.use(cookieParser());

app.use(express.json());

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/', userRouter);

app.use('/', cardRouter);

app.use((req, res, next) => {
  const err = new AppError(appErrors.notFound);
  next(err);
});

app.use(errors());

app.use((error, req, res, next) => {
  res.status(error.statusCode);
  res.json({
    message: error.message,
  });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
