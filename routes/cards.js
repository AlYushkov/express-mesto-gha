const { Router } = require('express');

const cardRouter = Router();

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.post('/cards', createCard);
cardRouter.get('/cards', getCards);
cardRouter.delete('/cards/:id', deleteCard);
cardRouter.put('/cards/:id/likes', likeCard);
cardRouter.delete('/cards/:id/likes', dislikeCard);
module.exports = cardRouter;
