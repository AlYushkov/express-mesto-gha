const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30,
    },
    about:
    {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30,
    },
    avatar:
    {
        type: String,
        required: true,
    }
});

module.exports = model('User', schema);