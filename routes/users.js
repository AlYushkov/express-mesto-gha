const { Router } = require('express');

const userRouter = Router();

const {
  createUser, getUser, getUsers, updateUser, updateAvatar
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
