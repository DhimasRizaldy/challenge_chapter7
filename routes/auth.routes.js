const { register, login, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const verivyToken = require('../libs/verivyToken');
const router = require('express').Router();
const prisma = require('../libs/prisma');

module.exports = function (io) {
  router.get('/', (req, res) => {
    const { message, status } = req.query;
    res.render('index', { message, status });
  });
  router.post('/api/login', login);

  router.get('/register', (req, res) => {
    const { message, status } = req.query;
    res.render('register', { message, status });
  });
  router.post('/api/register', register);

  router.get('/forgot-password', (req, res) => {
    const { message, status } = req.query;
    res.render('forgot-password', { message, status });
  });
  router.post('/api/forgot-password', forgotPassword);

  router.get('/reset-password', (req, res) => {
    res.render('reset-password', { token: req.query.token });
  });
  router.post('/api/reset-password', resetPassword.bind(null, io));

  router.get('/dashboard', verivyToken, async (req, res) => {
    try {
      const notifications = await prisma.notifications.findMany({
        where: {
          userId: req.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.render('dashboard', { ...req.user, notifications });
    } catch (error) {
      next(error);
    }
  });

  router.get('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/?message=Logout successfully&status=true');
  });

  return router;
};
