const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({}).populate(['owner', 'likes']
    .then((card) => {
      if (card.length === 0) {
        res.status(300).send({ msessage: 'Нет данных' });
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => {
      res.status(500).send({ msessage: 'Ошибка на сервере' });
    }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(404).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};
