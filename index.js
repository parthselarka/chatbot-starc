const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const chatbotRoutes = require('./routes/chatbot');

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Route for login page
app.get('/login', (req, res) => {
  res.render('login'); // Renders views/login.ejs
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.CHATBOT_PASSWORD) {
    req.session.isAuthenticated = true;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid password' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Chat page, protected by authentication
app.get('/', checkAuth, (req, res) => {
  res.render('chat'); // Renders views/chat.ejs
});

// API routes
app.use('/api', checkAuth, chatbotRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});