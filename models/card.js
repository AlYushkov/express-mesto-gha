const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link:
    {
      type: String,
      validate: {
        validator(v) {
          return /https?:\/\/[A-Za-z0-9:\-_~:/?#[\]@!$&'()*+,;=.]*([/]{1}.*\/?)$/.test(v);
        },
      },
      required: true,
    },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt:
    {
      type: Date,
      default: Date.now,
    },
});

module.exports = model('card', cardSchema);
