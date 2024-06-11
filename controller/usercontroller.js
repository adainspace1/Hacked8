const User = require('../model/usermodel')
const bcrypt = require('bcrypt');

const userController = {

  login: (req, res) => {
    const { email, password } = req.body;

    User.getUserByEmail(email, (err, user) => {
      if (err) {
        console.error('Error fetching user by email:', err);
        return res.status(500).send('Server error.');
      }
      if (!user) {
        return res.status(401).send('Invalid email or password.');
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).send('Server error.');
        }
        if (!isMatch) {
          return res.status(401).send('Invalid email or password.');
        }

        req.session.user = { id: user.id, name: user.name, email: user.email };
        res.redirect('/dashboard');
      });
    });
  },


  register: (req, res) => {
    const {firstname, lastname, email, password } = req.body;

    // Encrypt the password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) throw err;

      const newUser = {
        firstname,
        lastname,
        email,
        password: hashedPassword // Save the hashed password
      };

      User.createUser(newUser, (result) => {
        // Store user information in session
        req.session.user = { firstname, lastname,  email };

        // Redirect to the dashboard page
        res.redirect('/dashboard');
      });
    });
  },

  // Add a new method to handle the dashboard page
  dashboard: (req, res) => {
    if (req.session.user) {
      res.render('dashboard', { user: req.session.user });
    } else {
      res.redirect('/register');
    }
  },


    createUser:(req, res)=>{
        const newUser = req.body;
        User.createUser(newUser, (result)=>{
                res.json({id: result.inserId, ...newUser})
        })
    },

    deleteUser: (req, res) => {
      const userId = req.params.id;
  
      User.deleteUser(userId, (result) => {
        if (result.affectedRows > 0) {
          res.redirect('/users/list'); // Redirect to a list of users or a confirmation page
        } else {
          res.status(404).send('User not found');
        }
      });
    },

      updateUser: (req, res) => {
        const userId = req.params.id;
        const updatedUser = req.body;
        User.updateUser(userId, updatedUser, (result) => {
          res.json({ id: userId, ...updatedUser });
        });
      },

      listUsers: (req, res) => {
        User.getAllUsers((users) => {
          res.render('index', { users });
        });
      },
      
      showUser: (req, res) => {
        const userId = req.params.id;
        User.getUserById(userId, (user) => {
          res.json(user);
        });
      },

    
     
      logout: (req, res) => {
        console.log('Logout function called'); // Debug log
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Server error.');
          }
          res.redirect('/login'); // Ensure this route exists
        });
      },

      getUserDetails: (req, res) => {
        const userId = req.session.user.id; // Assuming user ID is stored in session
    
        db.query('SELECT firstname, lastname, email, img FROM users WHERE id = ?', [userId], (err, results) => {
          if (err) {
            console.error('Error fetching user details:', err);
            return res.status(500).send('Server error.');
          }
    
          if (results.length > 0) {
            const user = results[0];
            res.render('dashboard', { user });
          } else {
            res.redirect('/login');
          }
        });
      }
   
}

module.exports = userController;