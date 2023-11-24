const express = require('express');
// const path = require('path');
const mysql = require('mysql');
// const dotenv = require('dotenv').config();
const multer = require('multer');

const upload = multer();
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(upload.none());

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Handle koneksi database
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, Node.js!');
});

// Define Routes
app.use('/auth/v1', require('./routes/auth'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
