const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63365614e8919f0fa9d65a70',
  };
  next();
});

app.use('/', userRouter);

app.use('/', cardRouter);

app.use((req, res, next) => {
  const err = new Error('Не найдено!');
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  if (error.status === 404) {
    res.json({
      message: error.message,
    });
  } else {
    res.json({
      message: 'Ошибка на сервере',
    });
  }
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
