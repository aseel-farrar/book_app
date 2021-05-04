'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');


const PORT = process.env.PORT || 5000;

const server = express();
server.set('view engine', 'ejs');
server.use(express.urlencoded({ extended: true }));
server.use(express.static('./public'));

// ROUTES
server.get('/', (req, res) => {
    res.render('pages/searches/new');
});

server.post('/searches', searchesHandle);

server.get('/hello', (req, res) => {
    // res.send('Test Page...');
    res.render('pages/index');
});


// handlers
function searchesHandle(req, res) {
    let name = req.body.name;
    let choose = req.body.choose;
    let allBooks = [];
    // let googleBookURL = `https://www.googleapis.com/books/v1/volumes?q=+${name}:${choose}`;
    let googleBookURL = `https://www.googleapis.com/books/v1/volumes?q=+${name}:${choose}`;
    superagent.get(googleBookURL)
        .then(booksData => {
            booksData.body.items.forEach(item => {
                let book = new Book(item.volumeInfo);
                allBooks.push(book);
            })
            res.send(allBooks);
            // res.render('searches/show', { allBooks: allBooks });
        })
}


function Book(bookData) {
    this.title = bookData.title || 'No Title';
    this.img = bookData.imageLinks || `https://i.imgur.com/J5LVHEL.jpg`;
    this.author = bookData.authors || 'Unknown Author';
    this.description = bookData.description || 'No Description';
}





server.listen(PORT, () => {
    console.log(`listening to PROT ${PORT}`);
});

