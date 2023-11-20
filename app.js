require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const morgan = require('morgan');


app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(require('./routes/auth.routes')(io));

// 404 error handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
    data: null,
  });
});

// 500 error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: "Internal Server Error",
    data: err.message
  });
});


server.listen(port, () => {
  console.log(`Server listening at port: http://localhost:${port}`);
});
