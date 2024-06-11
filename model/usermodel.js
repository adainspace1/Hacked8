const db = require('../db');

const User = {

    createUser: (user , callback)=>{
        const query = "INSERT INTO users SET ?"
        db.query(query, user, (err, result)=>{
            if(err) throw err;
            callback(result)
        })
    },


    deleteUser: (id, callback)=>{
        const query = 'DELETE FROM users WHERE id = ?';
        db.query(query, [id], (err, result)=>{
                if(err) throw err;
                callback(result);
        })
    },

    updateUser: (id, user,  callback)=>{
        const query = 'UPDATE users SET ? WHERE id = ?';
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
        const query = 'SELECT * FROM users WHERE id = ?';
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

}

module.exports = User;