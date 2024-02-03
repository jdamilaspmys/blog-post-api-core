var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/posts');
const { connect } = require('./config/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const db = connect();

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postRouter)

// Swagger JSDoc configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Post NodeJs App',
      version: '1.0.0',
      description: 'API documentation for Blog Post Node.js app',
    },
    servers: [
      {
        url: `http://localhost:3000/api/v1`,
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
