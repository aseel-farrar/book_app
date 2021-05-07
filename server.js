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

// const client = new pg.Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.DEV_MODE ? false : { rejectUnauthorized: false },
// });

// ROUTES
server.get('/', homeHandle);


server.get('/books/:id', detailsHandle);


server.get('/newSearch', (req, res) => {
  res.render('pages/searches/new');
});

server.post('/books', addBookHandle);


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

function addBookHandle (req,res){
  // console.log(req.body);
  let SQL = `INSERT INTO books (title, img, author, description, isbn) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  let safeValue = [req.body.title, req.body.img, req.body.author, req.body.description, req.body.isbn];
  client.query(SQL,safeValue)
    .then(result=>{
      // console.log(result.rows[0]);
      res.redirect(`/books/${result.rows[0].id}`);
    });
}

function detailsHandle(req,res){
  let SQL = `SELECT * FROM books WHERE id = $1;`;
  let safeValue = [req.params.id];
  client.query(SQL,safeValue)
    .then(result=>{
      res.render('pages/books/detail', { bookDetails: result.rows[0]});
      // console.log(result.rows[0]);
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
      // console.log(booksData.body.items);

      booksData.body.items.forEach(item => {
        let book = new Book(item.volumeInfo);
        allBooks.push(book);

        // //! tem code seed to save in DB
        // let SQL = `INSERT INTO books (title, img, author, description, isbn) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        // let safeValue = [book.title, book.img, book.author, book.description, book.isbn];
        // // console.log(safeValue);
        // client.query(SQL, safeValue)
        //   .then(result => {
        //     console.log('DONE!!');
        //   });
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
  this.isbn = (bookData.industryIdentifiers) ? `ISBN type: ${bookData.industryIdentifiers[0].type}, identifier: ${bookData.industryIdentifiers[0].identifier}` : `No ISBN Available`;
  // console.log(ISBNNum);
}


//booksData.body.items.volumeInfo.industryIdentifiers
client.connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening to PROT ${PORT}`);
    });
  });
