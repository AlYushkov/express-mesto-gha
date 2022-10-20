const { Router } = require('express');

const { celebrate, Joi } = require('celebrate');

const userRouter = Router();

const {
  createUser, getUser, getUsers, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getMe);

userRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(24).max(24),
  }),
}), getUser);

userRouter.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/),
  }).unknown(true),
}), updateAvatar);

module.exports = userRouter;
