require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const upload = multer();
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(upload.none());

// SwaggerUI Docs
// Please Add $DOCS_URL and $DOCS_PORT for HTTP or $DOCS_HTTPS_URL for HTTPS to build ENV
const fallbackURL = 'http://localhost:8080';
let envURL = null;
if (process.env.DOCS_URL && process.env.DOCS_PORT) {
  envURL = `http://${process.env.DOCS_URL}:${process.env.DOCS_PORT}`;
} else if (process.env.DOCS_HTTPS_URL) {
  envURL = `${process.env.DOCS_HTTPS_URL}`;
}
// const envURL = process.env.DOCS_URL && process.env.DOCS_PORT ? `http://${process.env.DOCS_URL}:${process.env.DOCS_PORT}` : `${process.env.DOCS_HTTPS_URL}`;
const swOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Elevate Eats API Documentation',
    },
    servers: [
      {
        url: envURL || fallbackURL,
      },
    ],
  },
  apis: [
    './routes/*.js',
  ],
};

const swSpecs = swaggerJsdoc(swOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swSpecs),
);

// Database Connection
const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Connect to the database
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

// Middleware to handle database connection
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello, Node.js!');
});

// Define Routes
app.use('/auth/v1', require('./routes/auth'));
app.use('/branch/v1', require('./routes/branch'));
app.use('/employee/v1/', require('./routes/employee'));
app.use('/manager/v1/', require('./routes/manager'));
app.use('/menuCompany/v1/', require('./routes/menuCompany'));
app.use('/menuBranch/v1/', require('./routes/menuBranch'));
app.use('/item/v1/', require('./routes/items'));
app.use('/transaction/v1/', require('./routes/transaction'));
app.use('/analytics/v1/', require('./routes/analytics'));
app.use('/report/v1/', require('./routes/reports'));

// Start the server
const port = process.env.API_PORT || 8080;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
