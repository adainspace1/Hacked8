const User = require('../model/usermodel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const cloudinary = require("cloudinary").v2;






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


  teacher: (req, res) => {
    const upload = multer({ storage: multer.memoryStorage() }).single('img');

    upload(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).send('File upload error.');
      }

      const { name, price, description } = req.body;
      const imgBuffer = req.file ? req.file.buffer : null;

      if (imgBuffer) {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).send('Cloudinary upload error.');
          }

          const newCourse = {
            name,
            price,
            description,
            img: result.secure_url // Save Cloudinary URL
          };

          User.uploadCourse(newCourse, (result) => {
            req.session.user = {
              id: result.insertId,
              name,
              price,
              img: result.secure_url
            };

            res.send(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Hacked8</title>
              </head>
              <style>
                  body {
                      margin: 0;
                      font-family: Arial, sans-serif;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      background-color: #f0f0f0;
                      text-align: center;
                  }
                  .container {
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 10px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .center-image {
                      width: 150px;
                      height: 150px;
                      margin-bottom: 20px;
                  }
                  h1 {
                      font-size: 24px;
                      margin: 0;
                      color: #333333;
                  }
                  p {
                      font-size: 16px;
                      color: #666666;
                  }
              </style>
              <body>
                  <div class="container">
                      <img src="/images/light.png" alt="email" class="center-image">
                      <h1>Course Uploaded Successfully</h1>
                  </div>
              </body>
              </html>
            `);
          });
        }).end(imgBuffer);
      } else {
        const newCourse = {
          name,
          price,
          description,
          img: null
        };

        User.uploadCourse(newCourse, (result) => {
          req.session.user = {
            id: result.insertId,
            name,
            price,
            img: null
          };

          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hacked8</title>
            </head>
            <style>
                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f0f0f0;
                    text-align: center;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .center-image {
                    width: 150px;
                    height: 150px;
                    margin-bottom: 20px;
                }
                h1 {
                    font-size: 24px;
                    margin: 0;
                    color: #333333;
                }
                p {
                    font-size: 16px;
                    color: #666666;
                }
            </style>
            <body>
                <div class="container">
                    <img src="/images/light.png" alt="email" class="center-image">
                    <h1>Course Uploaded Successfully</h1>
                </div>
            </body>
            </html>
          `);
        });
      }
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

  register: (req, res) => {
    // Use multer with memory storage to handle file upload in-memory
    const upload = multer({ storage: multer.memoryStorage() }).single('profile_image');

    upload(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).send('File upload error.');
      }

      const { firstname, lastname, email, password } = req.body;
      const profileImageBuffer = req.file ? req.file.buffer : null;

      if (profileImageBuffer) {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).send('Cloudinary upload error.');
          }

          const newUser = {
            firstname,
            lastname,
            email,
            password: hashedPassword,
            profile_image: result.secure_url // Save Cloudinary URL
          };

          User.createUser(newUser, (result) => {
            req.session.user = {
              id: result.insertId,
              firstname,
              lastname,
              email,
              profile_image: result.secure_url
            };

            res.redirect('/dashboard');
          });
        }).end(profileImageBuffer);
      } else {
        const newUser = {
          firstname,
          lastname,
          email,
          password: hashedPassword,
          profile_image: null
        };

        User.createUser(newUser, (result) => {
          req.session.user = {
            id: result.insertId,
            firstname,
            lastname,
            email,
            profile_image: null
          };

          res.redirect('/dashboard');
        });
      }
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
  },

  comment: (req, res)=>{

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
};

module.exports = userController;
