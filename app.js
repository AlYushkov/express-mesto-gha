const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const userRouter = require('./routes/users.js');

const cardRouter = require('./routes/cards.js');

const app = express();


app.use(express.json());

app.use((req, res, next) => {
    req.user = {
        _id: '63365614e8919f0fa9d65a70'
    };

    next();
});

app.use('/', userRouter);



app.use('/', cardRouter);

mongoose.connect('mongodb://localhost:27017/mestodb')
    .then(() => {
        console.log("App's connected to the database");
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(PORT, () => {
    console.log(`App's listening on port ${PORT}`)
});


