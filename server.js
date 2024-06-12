// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userroutes');
const session = require('express-session');
const methodOverride = require('method-override');
const multer = require('multer');
const app = express();
const nodemailer = require('nodemailer');

const path = require('path');


// Logout function
const logout = (req, res) => {
  console.log('Logout function called'); // Debug log
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Server error.');
    }
    res.redirect('/login'); // Ensure this route exists
  });
};


// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Override methods for DELETE requests from forms
app.use(methodOverride('_method'));
// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configure session management
app.use(session({
  secret: 'hacked8_password', // Replace with your own secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));



// Use the user routes
app.use('/users', userRoutes);


app.get('/', (req, res)=>{
  res.render('index')
});


app.post('/sendmail', (req, res)=>{
  const { firstname, lastname,  email, message } = req.body;

  let transporter = nodemailer.createTransport({
            // Specify your email service provider
            service: 'Gmail', // e.g., 'gmail', 'hotmail', etc.
            auth: {
                user: 'shazaniyu@gmail.com', // Your email address
                pass: 'qkyfkijphqdixilh' // Your email password
            },
            tls:{
                rejectUnauthorized:false
            }
  })

  // Setup email data
          let mailOptions = {
            from: 'shaazaniyu@gmail.com', // Sender address
            to: 'zoeadoree33@gmail.com, shazaniyu@gmail.com', // List of recipients
            subject: 'JOB REQUEST', // Subject line
            text: `FirstName: ${firstname}\n LastName: ${lastname} \nEmail: ${email}\nMessage: ${message}`, // Plain text body
            // You can add HTML to the email if needed
            // html: '<p>Name: ' + name + '</p><p>Email: ' + email + '</p><p>Message: ' + message + '</p>'
          };

          // Send email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.render('email');
          });

});


// Add a route for the registration form
app.get('/register', (req, res) => {
    res.render('register2');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

// Route to list all users
app.get('/users/list', (req, res) => {
  res.redirect('/users/list');
});


// Route for the login form
app.get('/login', (req, res) => {
  res.render('login2');
});

// Logout route
app.get('/logout', logout);


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});