/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

class UserError extends Error {
  constructor(errName) {
    if (errName === 'ValidationError') {
      super('Некорректные параметры запроса');
      this.statusCode = 400;
      this.name = 'ValidationError';
    } else if (errName === 'CastError') {
      super('Нет найдено');
      this.statusCode = 404;
      this.name = 'CastError';
    } else {
      super('Ошибка на сервере');
      this.statusCode = 500;
      this.name = 'DefaultError';
    }
  }
}

/* common response handling */
function handleResponse(promise, res) {
  promise
    .then((user) => {
      if (res.headersSent) return;
      if (!user) {
        // eslint-disable-next-line consistent-return
        return Promise.reject(new UserError('CastError'));
      }
      res.send({ data: user });
    })
    .catch((e) => {
      if (e instanceof UserError) {
        res.status(e.statusCode).send({ message: e.message });
      } else {
        const err = new UserError(e.name);
        res.status(err.statusCode).send({ message: err.message });
      }
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  handleResponse(User.create({ name, about, avatar })
    .catch((e) => {
      const err = new UserError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.getUsers = (req, res) => {
  handleResponse(User.find({})
    .catch((e) => {
      const err = new UserError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.getUser = (req, res) => {
  handleResponse(User.findById(req.params.id)
    .catch((e) => {
      const err = new UserError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.updateUser = (req, res) => {
  handleResponse(User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .catch((e) => {
      const err = new UserError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.updateAvatar = (req, res) => {
  handleResponse(User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .catch((e) => {
      const err = new UserError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};
