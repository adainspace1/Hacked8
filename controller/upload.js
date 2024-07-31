const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');
const User = require('../model/usermodel')

const uploadProduct = async (req, res) => {
    const { name, price, description } = req.body;

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



      // Create a new user
      const newUser = {
        name,
        price,
        description,
        img: imageURL
      };

      User.uploadCourse(newUser, (result)=>{
        req.session.user = {
            id: result.insertId, // Assuming the user ID is returned after insert
            name,
            price,
            description,
            img: imageURL // Store the image URL in session
          };

          res.redirect('/courses')
      });

    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).send('Server error.');
    }
  }

module.exports = { uploadProduct };