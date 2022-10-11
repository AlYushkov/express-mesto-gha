const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('500'));
      }
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
  Card.find({}).populate(['owner', 'likes'])
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.length === 0) {
        return Promise.reject(new Error('300'));
      }
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === '300') {
        res.status(300).send({ msessage: 'Нет записей в базе данных' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('404'));
      }
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === '404') {
        res.status(404).send({ message: 'Нет данных!' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('404'));
      }
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === '404') {
        res.status(404).send({ message: 'Нет данных' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('404'));
      }
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === '404') {
        res.status(404).send({ message: 'Нет данных' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ msessage: 'Ошибка на сервере' });
      }
    });
};
