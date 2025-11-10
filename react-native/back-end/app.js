  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');
  const { MongoClient } = require('mongodb')
  const mongoURI = 'mongodb://127.0.0.1:27017'
  const client = new MongoClient(mongoURI)
  const fs = require('fs')
  const multer = require('multer')
  const cors = require('cors');


    ; (async () => {
      try {
        await client.connect()
        console.log('MongoDB connected')
        const db = client.db('phonebookdb')




        var app = express();
        const uploadDir = path.join(__dirname,'/public/uploads')

        if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });

  }

          const storage = multer.diskStorage({
            destination: (req, file , cb) => cb(null, uploadDir),
            filename: (req, file , cb) => {
              const ext = path.extname(file.originalname)
              const fileName = `${Date.now()}${ext}`
              cb(null, fileName)
            }
          }) 

          const upload = multer({storage})


         
        var indexRouter = require('./routes/index');
        var phonebooksRouter = require('./routes/phonebooks')(db, upload);
 
        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        
        app.set('view engine', 'react');
        
        app.use(cors());
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use('/uploads', express.static(path.join(__dirname,'/public/uploads')));



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