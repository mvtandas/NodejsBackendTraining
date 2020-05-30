const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '/.env'})



// IMPORT Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');



// Connect DB
mongoose.connect( process.env.DB_CONNECT,  { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log('Veritabanına bağlandı')
);


// Middleware
app.use(express.json());


// Route Mid
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(2080, () => console.log('Server Çalışıyor') );