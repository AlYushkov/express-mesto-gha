const { response } = require('express');
const User = require('../models/user');

class CastError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CastError';
        this.statusCode = 404;
    }
};

const castError = new CastError('Нет данных');

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
};

const validationError = new ValidationError('Некорректные параметры запроса');

/* return error object */

function errorCatcher(errorname, validationError, castError) {
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
        .then((user) => {
            if(res.headersSent) return;
            if (!user)
                return Promise.reject(castError);            
            res.send({ data: user }); 
        })
        .catch((e) => {
            if (e.statusCode < 500)
                res.status(e.statusCode).send({ message: e.message });
            else
                res.status(500).send({ message: 'Ошибка на сервере' });
        });
}

module.exports.getUsers = (req, res) => {
    handleResponse(
        User.find({}), res);
};

module.exports.getUser = (req, res) => {
    handleResponse(User.findById(req.params.id)
        .catch(() => {
            res.status(validationError.statusCode).send({ message: validationError.message });
        }
        ), res);
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    handleResponse(User.create({ name, about, avatar }), res);
};

module.exports.updateUser = (req, res) => {
    handleResponse(User.findByIdAndUpdate(req.user._id,
        { name: req.body.name },
        {
            new: true,
            runValidators: true,
            upsert: true
        }), res);
};

module.exports.updateAvatar = (req, res) => {
    handleResponse(User.findByIdAndUpdate(req.user._id,
        { avatar: req.body.avatar },
        {
            new: true,
            runValidators: true,
            upsert: true
        }), res);
};
