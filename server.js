// app.js
//this top section is where i imported all my installed  modules..
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userroutes');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const nodemailer = require('nodemailer');
const conn = require("./db")
const path = require('path');
const cors = require('cors');
require('dotenv').config();


function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}



// Logout function
const logout = (req, res) => {
  console.log('Logout function called'); // Debug log
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Server error.');
    }
    res.redirect('/'); // Ensure this route exists
  });
};


// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  conn.query(`SELECT * FROM courses`, (err, result)=>{
    res.render('index',{results:result, user: req.session.user})
})
  
});

app.get('/course/:id', isAuthenticated, (req, res) => {
  const courseId = req.params.id;

  conn.query('SELECT * FROM courses WHERE id = ?', [courseId], (err, result) => {
    if (err) {
      console.error('Error fetching course details:', err);
      return res.status(500).send('Server error.');
    }
    if (result.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.render('courses', { course: result[0], user: req.session.user });
  });
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
            subject: 'HACKED8', // Subject line
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


app.get('/users/create-profile', (req, res) => {
  // res.render('dashboard')
});

// Dashboard route
app.get('/dashboard', (req, res) => {

  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});



app.get('/dashboard/profile/:id', isAuthenticated , (req, res) => {
  const courseId = req.params.id;
  conn.query(`SELECT * FROM profile WHERE user_id = ?`,[courseId], (err, result)=>{
    console.log(result)
    if (err) {
      console.error('Error fetching course details:', err);
      return res.status(500).send('Server error.');
    }
    
    res.render('profile', { results: result[0], user: req.session.user });

    // if (req.session.user) {
    //   res.render('profile', {results: result,  user: req.session.user });
    // } else {
    //   res.redirect('/login');
    // }

})

});


app.get('/dashboard/message', (req, res) => {

  if (req.session.user) {
    res.render('message', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});


app.get('/users/admin/list', (req, res)=>{
  res.render('list_user')
})

app.get('/users/delete-user', (req, res)=>{
  res.send('user deleted')
})

app.get('/users/search-user', (req, res)=>{
  res.send('user searched')
})


// Route for the login form
app.get('/login', (req, res) => {
  res.render('login2');
});

// Logout route
app.get('/logout', logout);


// Start the server
const port = 3200;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});