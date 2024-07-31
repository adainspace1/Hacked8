const User = require('../model/usermodel');
const bcrypt = require('bcrypt');
const cloudinary = require('../cloudinary')
const streamifier = require('streamifier');











 const login = (req, res) => {
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
  }




const  regsterProfile =  (req, res)=>{
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

  }

 const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
      let imageURL = '';

      // If there is a file in the request
      if (req.file) {
        imageURL = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({resource_type: 'image'}, (error, result) => {
            if (error) {
              console.log("Cloudinary upload error:", error);
              return reject(new Error("Error uploading image to Cloudinary"));
            }
            resolve(result.secure_url);
          });

          // Convert file buffer to a readable stream
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user
      const newUser = {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        profile_image: imageURL
      };

      User.findUserByEmail(email, (err, existingUser) => {
        if (err) {
          return res.status(500).send('Internal server error.');
        }
        if (existingUser) {
          return res.status(400).send('Email already in use.');
        } else {
          User.createUser(newUser, (result) => {
            req.session.user = {
              id: result.insertId, // Assuming the user ID is returned after insert
              firstname,
              lastname,
              email,
              profile_image: imageURL // Store the image URL in session
            };

            console.log(req.session.user);

            res.redirect('/dashboard');
          });
        }
      });

    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).send('Server error.');
    }
  }

  // Handle the dashboard page
 const dashboard = (req, res) => {
    if (req.session.user) {
      res.render('dashboard', { user: req.session.user });
    } else {
      res.redirect('/register');
    }
  }

 const listAll = (req, res)=>{
    User.getAllUsers((users)=>{
        //console.log(users)
        res.render('list_user', {user: users})
    })
  }

 const deleteuser = (req, res)=>{
    const {id} = req.body

    User.deleteUser( id, (result)=>{
        //console.log('user deleted' + id)
        res.redirect('/users/admin/list')
    })
  }

  const search =  (req, res)=>{
    const searchCriteria = {};

    if (req.query.firstname) {
      searchCriteria.firstname = req.query.firstname;
  }

    User.searchUsers(searchCriteria, (results)=>{
        console.log(results)
        res.render('search', {result: results})
    })
  }

  const comment = (req, res)=>{

    const {message} = req.body;

    const newMessage={
      message:message
    }
    
    
    User.message(newMessage, (result)=>{
      req.session.user = {
            id: result.insertId, // Assuming the user ID is returned after insert
            message// Store the image info in session
          };

          console.log(req.session.user)
    })
  }


module.exports = {register, login, dashboard,comment,search, deleteuser, listAll, regsterProfile};
