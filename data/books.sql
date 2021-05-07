DROP TABLE IF EXISTS books;
CREATE TABLE IF NOT EXISTS books(
    ID SERIAL PRIMARY KEY,
    title  VARCHAR(255),
    img VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    isbn VARCHAR(255)
); 