var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb')
const mongoURI = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoURI)


  ; (async () => {
    try {
      await client.connect()
      console.log('MongoDB connected')
      const db = client.db('phonebookdb')




      var indexRouter = require('./routes/index');
      var phonebooksRouter = require('./routes/phonebooks')(db);

      var app = express();

      // view engine setup
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'react');

      app.use(logger('dev'));
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));



      app.use('/', indexRouter);
      app.use('/api/phonebooks', phonebooksRouter);

      // catch 404 and forward to error handler
      app.use(function (req, res, next) {
        next(createError(404));
      });

      // error handler
      app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
          status: 'error',
          message: err.message || 'Internal Server Error'
        });
      });


      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
      });

    } catch (err) {
      console.error('mongoDB connection failed:', err)
    }
  })();