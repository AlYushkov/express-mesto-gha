const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const { DEV_JWT_SECRET } = require('../utils/dev-key');

const { AppError, appErrors } = require('../utils/app-error');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
  // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new AppError(appErrors.serverError));
      }
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((e) => {
      let err;
      if (e.code === 11000) {
        err = new AppError(appErrors.conflict);
      } else if (e.name === 'ValidationError') {
        err = new AppError(appErrors.badRequest);
      } else if (e.statusCode) {
        err = e;
      } else {
        err = new AppError(appErrors.serverError);
      }
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      const err = new AppError(appErrors.serverError);
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      const err = new AppError(appErrors.serverError);
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new AppError(appErrors.notFound));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.statusCode) {
        err = e;
      } else if (e.name === 'CastError') {
        err = new AppError(appErrors.badRequest);
      } else {
        err = new AppError(appErrors.serverError);
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new AppError(appErrors.serverError));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.statusCode) {
        err = e;
      } else if (e.name === 'ValidationError') {
        err = new AppError(appErrors.badRequest);
      } else {
        err = new AppError(appErrors.serverError);
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new AppError(appErrors.serverError));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.statusCode) {
        err = e;
      } else if (e.name === 'ValidationError') {
        err = new AppError(appErrors.badRequest);
      } else {
        err = new AppError(appErrors.serverError);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, DEV_JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.statusCode) {
        err = e;
      } else {
        err = new AppError(appErrors.serverError);
      }
      next(err);
    });
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt').json({ message: 'До встречи!' });
  next();
};
