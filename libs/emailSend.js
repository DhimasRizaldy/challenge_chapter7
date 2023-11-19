const emailSend = (link) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .card {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      width: 400px;
      text-align: center;
    }

    h2 {
      font-size: 1.8rem;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 20px;
    }

    p {
      color: #4b5563;
      font-size: 1rem;
      margin-bottom: 20px;
    }

    .expiration-text {
      color: #f56565;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .reset-button {
      width: 100%;
      background-color: #4a5568;
      color: #ffffff;
      font-weight: bold;
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .reset-button:hover {
      background-color: #2d3748;
    }
  </style>
</head>

<body>
  <div class="card">
    <h2>Reset Password Akun</h2>
    <p>Jika Anda tidak mereset kata sandi, Anda bisa mengabaikan email ini.</p>
    <p class="expiration-text">Tautan reset kata sandi akan kedaluwarsa dalam 1 jam.</p>
    <a href="${link}" class="reset-button">Reset Kata Sandi</a>
  </div>
</body>

</html>
`;
};

module.exports = emailSend;