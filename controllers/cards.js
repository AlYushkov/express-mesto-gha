/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

class CardError extends Error {
  constructor(errName) {
    if (errName === 'ValidationError') {
      super('Некорректные параметры запроса');
      this.statusCode = 400;
      this.name = 'ValidationError';
    } else if (errName === 'CastError') {
      super('Некорректный тип данных');
      this.statusCode = 400;
      this.name = 'CastError';
    } else if (errName === 'NoDataError') {
      super('Нет данных');
      this.statusCode = 404;
      this.name = 'NoDataErrorr';
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
    .then((card) => {
      if (res.headersSent) return;
      if (!card) {
        // eslint-disable-next-line consistent-return
        return Promise.reject(new CardError('NoDataError'));
      }
      res.send({ data: card });
    })
    .catch((e) => {
      if (e instanceof CardError) {
        res.status(e.statusCode).send({ message: e.message });
      } else {
        const err = new CardError(e.name);
        res.status(err.statusCode).send({ message: err.message });
      }
    });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  handleResponse(Card.create({ name, link, owner: req.user._id })
    .catch((e) => {
      const err = new CardError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.getCards = (req, res) => {
  handleResponse(Card.find({}).populate(['owner', 'likes'])
    .catch((e) => {
      const err = new CardError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.deleteCard = (req, res) => {
  handleResponse(Card.findByIdAndRemove(req.params.cardId)
    .catch((e) => {
      const err = new CardError(e.name);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.likeCard = (req, res) => handleResponse(Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true }
)
  .catch((e) => {
    const err = new CardError(e.name);
    res.status(err.statusCode).send({ message: err.message });
  }), res);

module.exports.dislikeCard = (req, res) => handleResponse(Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true }
)
  .catch((e) => {
    const err = new CardError(e.name);
    res.status(err.statusCode).send({ message: err.message });
  }), res);
