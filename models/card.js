const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30,
    },
    link:
    {
        type: String,
        minlength: 6,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt:
    {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = model('card', cardSchema);
