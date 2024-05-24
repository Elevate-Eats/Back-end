require('dotenv').config();
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const db = require('./db/func/pool');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
      version: '1.0.0', // Always good to include a version
      description: 'API documentation for all endpoints related to Elevate Eats services.',
    },
    servers: [
      {
        url: envURL || fallbackURL,
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints related to User Authentication',
      },
      {
        name: 'Manager',
        description: 'Endpoints related to Manager Data',
      },
      {
        name: 'Branch',
        description: 'Endpoints related to Branch Data',
      },
      {
        name: 'Employee',
        description: 'Endpoints related to Employee Data',
      },
      {
        name: 'menuCompany',
        description: 'Endpoints related to Menu Data in Company Level',
      },
      {
        name: 'menuBranch',
        description: 'Endpoints related to Menu Data in Branch Level',
      },
      {
        name: 'Transaction',
        description: 'Endpoints related to Transaction Data',
      },
      {
        name: 'Item',
        description: 'Endpoints related to Item Data',
      },
      {
        name: 'Analytics',
        description: 'Endpoints related to Data Analytics',
      },
      {
        name: 'Report',
        description: 'Endpoints related to Report Data',
      },
    ],
  },
  apis: [
    './routes/*.js', // Ensure your route files use these tags consistently
  ],
};

module.exports = swOptions;

const swSpecs = swaggerJsdoc(swOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swSpecs),
);

// Test
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
app.use('/expense/v1/', require('./routes/expenses'));
app.use('/userProfile/v1/', require('./routes/picture'));

// Start the server
const port = process.env.API_PORT || 8080;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
