const db = require('../db');

const User = {

    createUser: (user , callback)=>{
        const query = "INSERT INTO users SET ?"
        db.query(query, user, (err, result)=>{
            if(err) throw err;
            callback(result)
        })
    },

    uploadCourse:(user, callback)=>{
      const query = "INSERT INTO courses SET ?"
      db.query(query, user, (err, result)=>{
        if(err) throw err
        callback(result)
      })

    },

    createProfile:(user, callback)=>{
      const query = "INSERT INTO profile SET ?"
      db.query(query, user, (err, result)=>{
            if(err) throw err;
            callback(result)
      })

    },

    message:(user, callback)=>{
      const query = "INSERT INTO comments SET ?"
      db.query(query, user, (err, result)=>{
            if(err) throw err;
            callback(result)
      })

    },


    deleteUser: (id, callback)=>{
        const query = 'DELETE FROM users WHERE user_id = ?';
        db.query(query, [id], (err, result)=>{
                if(err) throw err;
                callback(result);
        })
    },

    updateUser: (id, user,  callback)=>{
        const query = 'UPDATE users SET ? WHERE user_id = ?';
        db.query(query, [user, id], (err, result) => {
            if (err) throw err;
            callback(result);
          });
    },

    getAllUsers: (callback) => {
        const query = 'SELECT * FROM users';
        db.query(query, (err, results) => {
          if (err) throw err;
          callback(results);
        });
      },
      
      getUserById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE user_id = ?';
        db.query(query, [id], (err, result) => {
          if (err) throw err;
          callback(result);
        });
      },

      getUserByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
          if (err) return callback(err);
          callback(null, results[0]);
        });
      },

      findUserByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) {
                return callback(err);
            }
            if (results.length > 0) {
                return callback(null, results[0]); // Return the existing user
            }
            return callback(null, null); // No user found
        });
    },

      searchUsers: (searchCriteria, callback) => {
        let query = 'SELECT * FROM users WHERE 1=1'; // The initial condition is always true to append further conditions
        let queryParams = [];

        // Dynamically build the query based on the provided search criteria
        if (searchCriteria.firstname) {
            query += ' AND firstname LIKE ?';
            queryParams.push(`%${searchCriteria.firstname}%`);
        }

        // if (searchCriteria.email) {
        //     query += ' AND email LIKE ?';
        //     queryParams.push(`%${searchCriteria.email}%`);
        // }

        // Add other search criteria as needed

        db.query(query, queryParams, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },



    

}

module.exports = User;