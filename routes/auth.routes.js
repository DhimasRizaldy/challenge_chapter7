const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth.controllers');
const verifyToken = require('../libs/verifyToken');
const router = require('express').Router();


module.exports = function (io) {
  // login
  router.get('/', (req, res) => {
    const { message, status } = req.query;
    res.render('login', { message, status });
  });
  router.post('/api/login', login);

  // register
  router.get('/register', (req, res) => {
    const { message, status } = req.query;
    res.render('register', { message, status });
  });
  router.post('/api/register', register);

  // forgot password
  router.get('/forgot-password', (req, res) => {
    const { message, status } = req.query;
    res.render('forgot-password', { message, status });
  });
  router.post('/api/forgot-password', forgotPassword);

  // reset password
  router.get('/reset-password', (req, res) => {
    res.render('reset-password', { token: req.query.token });
  });
  router.post('/api/reset-password', resetPassword.bind(null, io));

  // dashboard
  router.get('/dashboard', verifyToken, async (req, res) => {
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

  // logout
  router.get('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/?message=Logout successfully!&status=true');
  });

  return router;
};
