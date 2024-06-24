const User = require('../model/usermodel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the 'uploads' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a unique filename
  }
});

const upload = multer({ storage: storage }).single('profile_image'); // Accept a single file with the name 'profile_image'

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

        req.session.user = {
          user_id: user.user_id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          profile_image: user.profile_image
        };
        console.log(req.session.user);
        res.redirect('/dashboard');
      });
    });
  },


  regsterProfile: (req, res)=>{
      const {fullname, stack, bio, id} = req.body;


    
      const newprofile = {
        
        fullname : fullname,
        stack: stack,
        bio: bio,
        user_id:id
       
      }
      console.log(newprofile)

      User.createProfile(newprofile, (result)=>{
      
          console.log(result)
          res.render('profile', {user: req.session.user})
      })

  },

  send:(req, res)=>{


  },
  register: (req, res) => {
    // Use multer to handle file upload
    upload(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).send('File upload error.');
      }

      const { firstname, lastname, email, password } = req.body;
      const profileImage = req.file ? req.file.filename : null; // Get the filename of the uploaded file
      
      User.findUserByEmail(email, (err, existingUser)=>{
        if(err){
            return res.status(500).send('Internal server error.');
        }
        if (existingUser) {
          // Email already exists, return an error
          return res.status(400).send('Email already in use.');
      }else{
          // Encrypt the password
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) throw err;

        const newUser = {
          firstname,
          lastname,
          email,
          password: hashedPassword, // Save the hashed password
          profile_image: profileImage // Save the profile image filename
        };

       

        User.createUser(newUser, ( result) => {
          // Store user information in session
          req.session.user = {
            id: result.insertId, // Assuming the user ID is returned after insert
            firstname,
            lastname,
            email,
            profile_image: profileImage // Store the image info in session
          };

          console.log(req.session.user)

          // Redirect to the dashboard page
          res.redirect('/dashboard');
        });
      });
      }
      })
      
    });
  },

  // Handle the dashboard page
  dashboard: (req, res) => {
    if (req.session.user) {
      res.render('dashboard', { user: req.session.user });
    } else {
      res.redirect('/register');
    }
  },

  listAll:(req, res)=>{
    User.getAllUsers((users)=>{
        //console.log(users)
        res.render('list_user', {user: users})
    })
  },

  deleteuser: (req, res)=>{
    const {id} = req.body

    User.deleteUser( id, (result)=>{
        //console.log('user deleted' + id)
        res.redirect('/users/admin/list')
    })
  },

  search: (req, res)=>{
    const searchCriteria = {};

    if (req.query.firstname) {
      searchCriteria.firstname = req.query.firstname;
  }

    User.searchUsers(searchCriteria, (results)=>{
        console.log(results)
        res.render('search', {result: results})
    })
  }
};

module.exports = userController;
