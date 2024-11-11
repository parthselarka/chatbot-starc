const PASSWORD = process.env.AUTH_PASSWORD;

module.exports = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  const { password } = req.body;
  if (password && password === PASSWORD) {
    req.session.isAuthenticated = true;
    return res.redirect('/chat');
  }
  res.status(401).send('Unauthorized');
};