const { Router } = require('express');

const { celebrate, Joi } = require('celebrate');

const userRouter = Router();

const {
  getUser, getUsers, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getMe);

userRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(24).max(24),
  }),
}), getUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/[A-Za-z0-9-_~:@/!/$&'()*+,;=?#[].]*([/]*.*\/?)$/),
  }).unknown(true),
}), updateAvatar);

module.exports = userRouter;
