require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { PORT, SENTRY_DSN } = process.env;
const morgan = require('morgan');

// sentry io
const Sentry = require('@sentry/node');

// config sentry io
Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app })
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(Sentry.Handlers.tracingHandler());

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

// config sentry io
app.use(Sentry.Handlers.errorHandler());


server.listen(PORT, () => {
  console.log(`Server listening at port: http://localhost:${PORT}`);
});
