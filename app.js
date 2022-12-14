const express = require('express');

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200,
  credentials: true,
};

const { celebrate, Joi, errors } = require('celebrate');

const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { createUser, login, logout } = require('./controllers/users');

const { AppError, appErrors } = require('./utils/app-error');

const app = express();

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().regex(/^https?:\/\/[A-Za-z0-9-_~:@/!/$&'()*+,;=?#[].]*([/]*.*\/?)$/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.get('/signuot', logout);

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  const err = new AppError(appErrors.notFound);
  next(err);
});

app.use(errors());

app.use((error, req, res, next) => {
  const errMessage = error.statusCode ? error.message : 'Ошибка на серверe';
  res.status(error.statusCode || 500).json({ message: errMessage });

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
