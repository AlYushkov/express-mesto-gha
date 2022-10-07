/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

class CardError extends Error {
  constructor(errStatus) {
    if (errStatus === 400) {
      super('Некорректные параметры запроса');
      this.statusCode = errStatus;
      this.name = 'ValidationError';
    } else if (errStatus === 404) {
      super('Нет данных');
      this.statusCode = errStatus;
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
    .then((card) => {
      if (res.headersSent) return;
      if (!card) {
        // eslint-disable-next-line consistent-return
        return Promise.reject(new CardError(404));
      }
      res.send({ data: card });
    })
    .catch((e) => {
      if (e instanceof CardError) {
        res.status(e.statusCode).send({ message: e.message });
      } else {
        const err = new CardError(e.statusCode);
        res.status(err.statusCode).send({ message: err.message });
      }
    });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  handleResponse(Card.create({ name, link, owner: req.user._id })
    .catch((e) => {
      const err = new CardError(e.statusCode);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.getCards = (req, res) => {
  handleResponse(Card.find({}).populate(['owner', 'likes'])
    .catch((e) => {
      const err = new CardError(e.statusCode);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.deleteCard = (req, res) => {
  handleResponse(Card.findByIdAndRemove(req.params.cardId)
    .catch((e) => {
      const err = new CardError(e.statusCode);
      res.status(err.statusCode).send({ message: err.message });
    }), res);
};

module.exports.likeCard = (req, res) => handleResponse(Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true }
)
  .catch((e) => {
    const err = new CardError(e.statusCode);
    res.status(err.statusCode).send({ message: err.message });
  }), res);

module.exports.dislikeCard = (req, res) => handleResponse(Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true }
)
  .catch((e) => {
    const err = new CardError(e.statusCode);
    res.status(err.statusCode).send({ message: err.message });
  }), res);
