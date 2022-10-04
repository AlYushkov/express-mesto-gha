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

/*common response handling */
function handleResponse(promise, res) {
    promise
        .then((user) => {
            if (res.headersSent) return;
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
    handleResponse(User.find({})
        .catch(() => {
            res.status(validationError.statusCode).send({ message: validationError.message });
        }), res);
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
    handleResponse(User.create({ name, about, avatar })
        .catch(() => {
            res.status(validationError.statusCode).send({ message: validationError.message });
        }
        ), res);
};

module.exports.updateUser = (req, res) => {
    handleResponse(User.findByIdAndUpdate(req.user._id,
        { name: req.body.name, about: req.body.about },
        {
            new: true,
            runValidators: true,
            upsert: true
        })
        .catch(() => {
            res.status(validationError.statusCode).send({ message: validationError.message });
        }
        ), res);
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
