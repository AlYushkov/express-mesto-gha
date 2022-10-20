const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const { DEV_JWT_SECRET } = require('../utils/dev-key');

const { AppError, appErrors } = require('../utils/app-error');

module.exports.createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error('409'));
      }
      return bcrypt.hash(req.body.password, 10);
    })
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
        return Promise.reject(new Error('500'));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.message === '409') {
        err = new AppError(appErrors.conflict);
      } else if (e.name === 'ValidationError') {
        err = new AppError(appErrors.badRequest);
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
        return Promise.reject(new Error('404'));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.message === '404') {
        err = new AppError(appErrors.notFound);
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
        return Promise.reject(new Error('500'));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.name === 'ValidationError') {
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
        return Promise.reject(new Error('500'));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      let err;
      if (e.name === 'ValidationError') {
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
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch((e) => {
      let err;
      if (e.message === '401' || e.status === '401') {
        err = new AppError(appErrors.notAuthorized);
      } else {
        err = new AppError(appErrors.serverError);
      }
      next(err);
    });
};
