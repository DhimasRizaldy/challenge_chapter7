const prisma = require('../libs/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../libs/nodemailer');
const emailTemplate = require('../libs/emailTemplate');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const isExist = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (isExist) {
      res.redirect('/register?message=Email already exist&status=false');
    }

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    await prisma.notifications.create({
      data: {
        userId: user.id,
        title: 'Register',
        body: `Selamat datang ${user.name}!`,
      },
    });

    res.redirect('/register?message=Register successfully&status=true');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    sdsd
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.redirect('/?message=Email not found&status=false');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.redirect('/?message=Email or password wrong&status=false');
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });

    res.redirect(`/dashboard`);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.redirect('/forgot-password?message=Email not found&status=false');
    } else {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const link = `http://localhost:3000/reset-password/?token=${token}`;
      await sendEmail({
        to: email,
        subject: 'Reset Password',
        html: emailTemplate(link),
      });

      res.redirect(`/forgot-password?message=Reset password link telah dikirim ke emailmu&status=true`);
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (io, req, res, next) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      res.redirect('/?message=Token invalid&status=false');
    }

    const { password, confirm_password } = req.body;

    if (password !== confirm_password) {
      res.redirect('/?message=Password dan Confirm Password tidak sama&status=false');
    }

    await prisma.users.update({
      where: {
        email: decoded.email,
      },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });
    io.emit(`userId-${decoded.id}-notification`, {
      message: `Ganti password berhasil!`,
      category: 'info',
    });

    await prisma.notifications.create({
      data: {
        userId: decoded.id,
        title: 'Reset Password',
        body: `Ganti password berhasil!`,
      },
    });

    res.redirect('/?message=Reset password berhasil&status=true');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
