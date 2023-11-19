const emailTemplate = (link) => {
  return `<body style="background-color: #f3f4f6; display: flex; justify-content: center; align-items: center; height: 100vh;">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); width: 300px;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 20px;">Reset Password Akun</h2>
        <p style="color: #4b5563; margin-bottom: 20px;">Jika Anda tidak meminta reset password, Anda dapat menghiraukan email ini.</p>
        <p style="color: #f56565; font-size: 0.8rem; margin-bottom: 20px;">Link reset password akan kadaluarsa dalam 1 jam.</p>
        <a href=${link} style="display: block; text-align: center; background-color: #1e40af; color: #ffffff; font-weight: bold; padding: 10px 20px; border-radius: 4px; text-decoration: none; cursor: pointer;">Reset Password</a>
    </div>
</body>`;
};

module.exports = emailTemplate;
