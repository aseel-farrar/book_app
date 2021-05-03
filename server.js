'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');


const PORT = process.env.PORT || 5000;

const server = express();
server.set('view engine', 'ejs');
server.use(express.urlencoded({extended:true}));
server.use(express.static('./public'));

server.get('/', (req, res) => {
    // res.send('Home Page...');
    res.render('pages/searches/new');
});

server.get('/hello', (req, res) => {
    // res.send('Test Page...');
    res.render('pages/index');
});

server.listen(PORT, () => {
    console.log(`listening to PROT ${PORT}`);
});