const User = require('../models/user');

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
        .then((user) => {
            if (!user) {
                return Promise.reject(castError);
            }
            res.send({ data: user })
        })
        .catch((e) => {
            const error = errorCatcher(e.name, validationError, castError);
            if (error) {
                promise.res.status(error.status).send({ message: error.message });
                return;
            }
            res.status(500).send({ message: 'Ошибка на сервере' });
        });
}

module.exports.getUsers = (req, res) => {
    handleResponse(User.find({}), res);
};

module.exports.getUser = (req, res) => {
    handleResponse(User.findById(req.params.id), res);
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
