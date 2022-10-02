const { Router } = require('express');

const cardRouter = Router();

const { createCard, getCards, deleteCard, likeCard, dislikeCard, getCard } = require('../controllers/cards');

cardRouter.post('/cards', createCard);
cardRouter.get('/cards', getCards);
cardRouter.get('/cards/:cardId', getCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);
module.exports = cardRouter;
