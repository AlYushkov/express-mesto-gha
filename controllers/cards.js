const Card = require('../models/card.js');

class CastError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CastError';
        this.statusCode = 404;
    }
};

const castError = new CastError('Ошибочный тип или отсутсвие данных');

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
};

const validationError = new ValidationError('Переданы некорректные данные');

/* return error object */

function errorCatcher(errorname, validationError, castError) {
    console.log(errorname);
    if (errorname === 'ValidationError') {
        return { status: validationError.statusCode, message: validationError.message };
    }
    else if (errorname === 'CastError') {
        return { status: castError.statusCode, message: castError.message };;
    }
    return null; //  uncaughtException 
};

/*common response handling */
function handleResponse(promise, res) {
    promise
        .then(card => {
            if (res.headersSent) return;
            if (!card)
                return Promise.reject(castError);
            res.send({ data: card });
        })
        .catch((e) => {
            if (e.statusCode < 500)
                res.status(e.statusCode).send({ message: e.message });
            else
                res.status(500).send({ message: 'Ошибка на сервере' });
        });
}

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    handleResponse(Card.create({ name, link, owner: req.user._id }), res);
};
module.exports.getCards = (req, res) => {
    handleResponse(Card.find({}).populate(['owner', 'likes']), res);
};

module.exports.getCard = (req, res) => {
    handleResponse(Card.findById(req.params.cardId).populate(['owner', 'likes']), res);
};

module.exports.deleteCard = (req, res) => {
    handleResponse(Card.findByIdAndRemove(req.params.cardId), res);
};

module.exports.likeCard = (req, res) =>
    handleResponse(Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true }), res);

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
