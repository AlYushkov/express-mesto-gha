const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const User = require('./user.js');

const likesSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    about:
    {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    avatar:
    {
        type: String,
        required: true,
    },
    _id:
    {
        type: String,
        required: true,
    },
    cohort:
    {
        type: String,
        required: true,
    },
})

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
