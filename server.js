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

const client = new pg.Client(process.env.DATABASE_URL);


// ROUTES
server.get('/', homeHandle);

server.get('/newSearch', (req, res) => {
  res.render('pages/searches/new');
});

server.post('/searches', searchesHandle);

server.get('/hello', (req, res) => {
  // res.send('Test Page...');
  res.render('pages/index');
});

server.get('*', (req, res) => {
  res.render('pages/error');
});


// handlers
function homeHandle(req, res) {
  let SQL = `SELECT * FROM books;`;
  client.query(SQL)
    .then(favBooksData => {
      res.render('pages/index', { favBooksData: favBooksData.rows });
    });
}

function searchesHandle(req, res) {
  let name = req.body.titleOrAuthor;
  let choose = req.body.choose;
  // console.log(req.body);
  let allBooks = [];
  // let googleBookURL = `https://www.googleapis.com/books/v1/volumes?q=+${choose}:${name}`;
  let googleBookURL = `https://www.googleapis.com/books/v1/volumes?q=+${name}:${choose}`;
  superagent.get(googleBookURL)
    .then(booksData => {
      console.log(booksData.body.items);

      booksData.body.items.forEach(item => {
        let book = new Book(item.volumeInfo);
        allBooks.push(book);

        // //! tem code to save in DB
        // let SQL = `INSERT INTO books (title, img, author, description) VALUES ($1, $2, $3, $4) RETURNING *;`;
        // let safeValue = [book.title, book.img, book.author, book.description];
        // // console.log(safeValue);
        // client.query(SQL, safeValue)
        //     .then(result => {
        //         console.log('DONE!!')
        //     });
        // //!!!!!!!!!!
      });
      // res.send(booksData.body.items[0]);
      res.render('pages/searches/show', { allBooksData: allBooks });
    });
}



//book constructor
function Book(bookData) {
  // console.log(bookData);
  this.title = bookData.title || 'No Title';
  this.img = bookData.imageLinks.smallThumbnail || bookData.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
  this.author = bookData.authors || 'Unknown Author';
  this.description = bookData.description || 'No Description Available';
  // this.isbn = (bookData.industryIdentifiers) ? `ISBN type: ${bookData.industryIdentifiers[0].type}, identifier: ${bookData.industryIdentifiers[0].identifier}` : `No ISBN Available`;
  // console.log(ISBNNum);

}
//booksData.body.items.volumeInfo.industryIdentifiers
client.connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening to PROT ${PORT}`);
    });
  });
