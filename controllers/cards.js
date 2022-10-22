const Card = require('../models/card');

const { AppError, appErrors } = require('../utils/app-error');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new AppError(appErrors.serverError));
      }
      res.send({ data: card });
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

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      const err = new AppError(appErrors.serverError);
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
  // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new AppError(appErrors.notFound));
      } if (String(card.owner) !== req.user._id) {
        return Promise.reject(new AppError(appErrors.forbidden));
      }
    })
    // eslint-disable-next-line consistent-return
    .then(() => {
      const promise = Card.findByIdAndRemove(cardId);
      if (!promise) {
        return Promise.reject(new AppError(appErrors.serverError));
      }
      promise // eslint-disable-next-line consistent-return
        .then((card) => {
          if (!card) {
            return Promise.reject(new AppError(appErrors.serverError));
          }
          res.send({ data: card });
        });
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

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new AppError(appErrors.notFound));
      }
      res.send({ data: card });
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

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new AppError(appErrors.notFound));
      }
      res.send({ data: card });
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
