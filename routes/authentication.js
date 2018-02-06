const User = require('../models/user');

module.exports = (router) => {

    router.post('/register', (req, res) => {
    if(!req.body.email || !req.body.password || !req.body.username) {
        res.json({ success: false, message: 'You must provide all field'});
    } else {
    let user = new User({
        email: req.body.email.toLowerCase(),
        username: req.body.username.toLowerCase(),
        password: req.body.password
    });
    user.save((err) => {
       if (err) {
           if(err.code === 11000) {
               res.json({success: false, message: 'Username or email already exists'})
           } else {
               if (err.errors) {
                   if (err.errors.email) {
                       res.json({success: false, message: err.errors.email.message})
                   } else {
                       // Check if validation error is in the username field
                       if (err.errors.username) {
                           res.json({success: false, message: err.errors.username.message}); // Return error
                       } else {
                           // Check if validation error is in the password field
                           if (err.errors.password) {
                               res.json({success: false, message: err.errors.password.message}); // Return error
                           } else {
                               res.json({success: false, message: err}); // Return any other error not already covered
                           }
                       }
                   }
               } else {
                   res.json({success: false, message: 'Could not save user. Error: ', err})
               }
           }
       } else {
           res.json({success: true, message: 'Account registered!'});
       }
    });
    }
    });

    router.get('/checkEmail/:email', (req,res) => {
        if(!req.params.email) {
            res.json({ success: false, message: 'E-mail was not provided'})
        } else {
            User.findOne({ email: req.params.email}, (err, user) => {
                if (err) {
                    res.json({success: false, message: err})
                } else {
                    if (user) {
                        res.json({success: false, message: 'E-mail is already taken'})
                    } else {
                        res.json({ success: true, message: "E-mail is available"})
                    }
                }
            })
        }
    });

    router.get('/checkUsername/:username', (req,res) => {
        if(!req.params.username) {
            res.json({ success: false, message: 'E-mail was not provided'})
        } else {
            User.findOne({ username: req.params.username}, (err, user) => {
                if (err) {
                    res.json({success: false, message: err})
                } else {
                    if (user) {
                        res.json({success:false, message: 'Username is already taken'})
                    } else {
                        res.json({ success: true, message: "Username is available"})
                    }
                }
            })
        }
    });

    return router;
};