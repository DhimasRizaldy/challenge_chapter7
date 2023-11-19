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

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

server.listen(port, () => {
  console.log(`Server listening at port: http://localhost:${port}`);
});
