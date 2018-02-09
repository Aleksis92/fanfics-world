const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');
const AuthFacebookStrategy = require('passport-facebook').Strategy;
const AuthVKStrategy = require('passport-vkontakte').Strategy;
const AuthTwitterStrategy = require('passport-twitter').Strategy;

function passportSocialAuthSuccess() {

}

passport.use('facebook', new AuthFacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'profileUrl', "first_name", "last_name", "gender", "picture"]
    },
    function (accessToken, refreshToken, profile, done) {
        profile.socialId = profile.id;
        User.findOne({ socialId: profile.socialId}, (err, user) => {
            if (err) {throw err}
            if (user && user != null) {
                return done(null, {
                    _id: user._id,
                    socialId: user.socialId,
                    username: user.displayName,
                    photoUrl: user.photoUrl,
                    profileUrl: user.profileUrl,
                    provider: user.provider,
                    role: user.role
                });
            }
            else {
                profile.photoUrl = profile.photos[0].value;
                profile.username = profile.displayName;
                const user = new User(profile);
                user.save(function (err, user, affected) {
                    if (!err) {
                        return done(null, {
                            _id: user._id,
                            socialId: user.socialId,
                            username: user.displayName,
                            photoUrl: user.photoUrl,
                            profileUrl: user.profileUrl,
                            provider: user.provider,
                            role: user.role
                        });
                    }
                    else return done(err)
                });

            }
        })
    }
));

passport.use('vkontakte', new AuthVKStrategy({
        clientID: config.vkontakte.clientID,
        clientSecret: config.vkontakte.clientSecret,
        callbackURL: config.vkontakte.callbackURL,
        profileFields: ['id', 'displayName', 'profileUrl', "first_name", "last_name", "gender", "picture"]
    },
    async function (accessToken, refreshToken, profile, done) {
        profile.socialId = profile.id;
        profile.photoUrl = profile.photos[0].value;
        profile.username = profile.displayName;
        User.findOne({ socialId: profile.socialId}, (err, user) => {
            if (err) {throw err}
            if (user && user != null) {
                User.findByIdAndUpdate({_id: user._id}, user);
                return done(null, {
                    _id: user._id,
                    socialId: profile.socialId,
                    username: profile.displayName,
                    photoUrl: profile.photoUrl,
                    profileUrl: profile.profileUrl,
                    provider: profile.provider,
                    role: user.role
                });
            }
            else {
                const user = new User(profile);
                console.log(user)
                user.save(function (err, user, affected) {
                    if (!err) {
                        return done(null, {
                            _id: user._id,
                            socialId: user.socialId,
                            username: user.displayName,
                            photoUrl: user.photoUrl,
                            profileUrl: user.profileUrl,
                            provider: user.provider,
                            role: user.role
                        });
                    }
                    else return done(err)
                });

            }
        })
    }
));

passport.use('twitter', new AuthTwitterStrategy.Strategy({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: config.twitter.callbackURL,
        profileFields: ['id', 'displayName', 'profileUrl', "first_name", "last_name", "gender", "picture"]
    },
    async function (accessToken, refreshToken, profile, done) {
        profile.socialId = profile.id;
        profile.photoUrl = profile.photos[0].value;
        profile.username = profile.displayName;
        User.findOne({ socialId: profile.socialId}, (err, user) => {
            if (err) {throw err}
            if (user && user != null) {
                User.findByIdAndUpdate({_id: user._id}, user);
                return done(null, {
                    _id: user._id,
                    socialId: profile.socialId,
                    username: profile.displayName,
                    photoUrl: profile.photoUrl,
                    profileUrl: profile.profileUrl,
                    provider: profile.provider,
                    role: user.role
                });
            }
            else {
                const user = new User(profile);
                console.log(user)
                user.save(function (err, user, affected) {
                    if (!err) {
                        return done(null, {
                            _id: user._id,
                            socialId: user.socialId,
                            username: user.displayName,
                            photoUrl: user.photoUrl,
                            profileUrl: user.profileUrl,
                            provider: user.provider,
                            role: user.role
                        });
                    }
                    else return done(err)
                });

            }
        })
    }
));

passport.serializeUser(function (user, done) {
    token = jwt.sign({ userId: user._id, username: user.username}, config.mongoose.secret, { expiresIn: '24h'});
    done(null, user._id)
});


passport.deserializeUser(function (data, done) {
    try {
        done(null, data);
    } catch (e) {
        done(e)
    }
});

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

    router.post('/login', (req, res) => {
       if (!req.body.username) {
           res.json({ success: false, message: 'No username was provided'})
       } else {
           if (!req.body.password) {
               res.json({ success: false, message: 'No password was provided'})
           } else {
               User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                   if (err) {
                       res.json({success: false, message: err });
                   } else {
                       if (!user) {
                           res.json({ success: false, message: 'Username not found'})
                       } else {
                           const validPassword = user.comparePassword(req.body.password);
                           if (!validPassword) {
                               res.json({ success: false, message: 'Password invalid'});
                           } else {
                               const token = jwt.sign({userId: user._id}, config.mongoose.secret, {expiresIn: '24h'});
                               res.json({ success: true, message: 'Success!', token: token, user: {role: user.role}})
                           }
                       }
                   }
               });
           }

       }
    });

    router.get('/social/facebook',
        passport.authenticate('facebook', { session: false}),
    );

    router.get('/social/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/login/:' + token);
        }
    );

    router.get('/social/vkontakte',
        passport.authenticate('vkontakte', {
            session: false,
            scope: ['friends']}),
        );

    router.get('/social/vkontakte/callback',
        passport.authenticate('vkontakte', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            res.redirect('/login/:' + token);
        });

    router.get('/social/twitter',
        passport.authenticate('twitter', { session: false }),
        );

    router.get('/social/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: '/auth'
        }),
        function (req, res) {
            res.redirect('/login/:' + token);
        });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({success: false, message: 'No token provided'})
        } else {
            jwt.verify(token, config.mongoose.secret, (err, decoded) => {
                if(err) {
                    res.json({ success: false, message: 'Token invalid: ' + err});
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId}).select('username email role photoUrl').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err});
            } else {
                if (!user) {
                    res.json({ success: false, message: 'User not found'})
                } else {
                    res.json({ success: true, user: user})
                }
            }
        })
    });

    return router;
};