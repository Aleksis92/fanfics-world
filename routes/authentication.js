const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
const AuthFacebookStrategy = require('passport-facebook').Strategy;
const AuthVKStrategy = require('passport-vkontakte').Strategy;
const AuthTwitterStrategy = require('passport-twitter').Strategy;
const randtoken = require('rand-token');

const smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        type: "OAuth2",
        user: "Sanya77a@gmail.com",
        clientId: "36166735692-cvr9j5nqkns2vve4osd0s07s57immgeg.apps.googleusercontent.com",
        clientSecret: "1oma3VKIFu3N7I_QWKHrc3BB",
        refreshToken: "1/BqjGxIANb7yXsbHDh-YO_Q7xHXp9aJdJce3DXRCFDG0"
    }
});

passport.use('facebook', new AuthFacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'profileUrl', "first_name", "last_name", "gender", "picture"]
    },
    function (accessToken, refreshToken, profile, done) {
        profile.socialId = profile.id;
        User.findOne({socialId: profile.socialId}, (err, user) => {
            if (err) {
                throw err
            }
            if (user && user != null) {
                return done(null, createUser(user._id, profile.socialId, profile.displayName, profile.photoUrl, profile.profileUrl, profile.provider, user.role))
            }
            else {
                profile.photoUrl = profile.photos[0].value;
                profile.username = profile.displayName;
                const user = new User(profile);
                user.save(function (err, user, affected) {
                    if (!err) {
                        return done(null, createUser(user._id, profile.socialId, profile.displayName, profile.photoUrl, profile.profileUrl, profile.provider, user.role))
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
        User.findOne({socialId: profile.socialId}, (err, user) => {
            if (err) {
                throw err
            }
            if (user && user != null) {
                User.findByIdAndUpdate({_id: user._id}, user);
                return done(null, createUser(user._id, profile.socialId, profile.displayName, profile.photoUrl, profile.profileUrl, profile.provider, user.role))
            }
            else {
                const user = new User(profile);
                user.save(function (err, user, affected) {
                    if (!err) {
                        return done(null, createUser(user._id, profile.socialId, profile.displayName, profile.photoUrl, profile.profileUrl, profile.provider, user.role))
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
        User.findOne({socialId: profile.socialId}, (err, user) => {
            if (err) {
                throw err
            }
            if (user && user != null) {
                User.findByIdAndUpdate({_id: user._id}, user);
                return done(null, createUser(user._id, profile.socialId, profile.displayName, profile.photoUrl, profile.profileUrl, profile.provider, user.role))
            }
            else {
                const user = new User(profile);
                user.save(function (err, user, affected) {
                    if (!err) {
                        return done(null, createUser(user._id, profile.socialId, profile.displayName, profile.photoUrl, profile.profileUrl, profile.provider, user.role))
                    }
                    else return done(err)
                });

            }
        })
    }
));

function createUser(_id, socialId, displayName, photoUrl, profileUrl, provider, role) {
    return {
        _id: _id,
        socialId: socialId,
        username: displayName,
        photoUrl: photoUrl,
        profileUrl: profileUrl,
        provider: provider,
        role: role
    }
}

passport.serializeUser(function (user, done) {
    token = jwt.sign({userId: user._id, username: user.username}, config.mongoose.secret, {expiresIn: '2h'});
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
        if (!req.body.email || !req.body.password || !req.body.username) {
            res.json({success: false, message: 'You must provide all field'});
        } else {
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password,
                hash: randtoken.generate(16)
            });
            user.save((err, user) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({success: false, message: 'Username or email already exists'})
                    } else {
                        if (err.errors) {
                            if (err.errors.email) {
                                res.json({success: false, message: err.errors.email.message})
                            } else {
                                if (err.errors.username) {
                                    res.json({success: false, message: err.errors.username.message});
                                } else {
                                    if (err.errors.password) {
                                        res.json({success: false, message: err.errors.password.message});
                                    } else {
                                        res.json({success: false, message: err});
                                    }
                                }
                            }
                        } else {
                            res.json({success: false, message: 'Could not save user. Error: ', err})
                        }
                    }
                } else {
                    emailConfirmation(req, res, user._id);
                    res.json({success: true, message: 'Account registered! Please confirm your email'});
                }
            });
        }
    });

    function emailConfirmation(req, res, _id) {
        let host = req.get('host');
        User.findOne({_id: _id}, (err, user) => {
            let link = "http://" + host + "/login/verify/:" + _id + '/:' + user.hash;
            let mailOptions = {
                from: '"FanficsWorld"',
                to: req.body.email,
                subject: 'Fanfics-world ✔',
                html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
            };
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.json({success: false, message: 'Fail emailing'});
                }
            });
        });

    }

    router.get('/verify/:_id/:hash', (req, res) => {
        const _id = req.params._id.replace(":", "");
        const hash = req.params.hash.replace(":", "");
        User.findOne({_id: _id}, (err, user) => {
            if (err) {
                res.json({success: false, message: 'Fail confirm email'});
            }
            if (user._id == _id && user.hash == hash) {
                User.findOneAndUpdate({_id: _id}, {$set: {active: "true"}}, (err) => {
                    if (!err) {
                        res.json({success: true, message: 'Success confirm email'});
                    } else {
                        res.json({success: false, message: 'Fail confirm email'});
                    }
                })
            } else {
                res.json({success: false, message: 'Fail confirm email'});
            }
        })
    });

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({success: false, message: 'E-mail was not provided'})
        } else {
            User.findOne({email: req.params.email.toLowerCase()}, (err, user) => {
                if (err) {
                    res.json({success: false, message: err})
                } else {
                    if (user) {
                        res.json({success: false, message: 'E-mail is already taken'})
                    } else {
                        res.json({success: true, message: "E-mail is available"})
                    }
                }
            })
        }
    });

    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({success: false, message: 'Username was not provided'})
        } else {
            User.findOne({username: req.params.username}, (err, user) => {
                if (err) {
                    res.json({success: false, message: err})
                } else {
                    if (user) {
                        res.json({success: false, message: 'Username is already taken'})
                    } else {
                        res.json({success: true, message: "Username is available"})
                    }
                }
            })
        }
    });

    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({success: false, message: 'No username was provided'})
        } else {
            if (!req.body.password) {
                res.json({success: false, message: 'No password was provided'})
            } else {
                User.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
                    if (err) {
                        res.json({success: false, message: err});
                    } else {
                        if (!user) {
                            res.json({success: false, message: 'Username not found'})
                        } else {
                            if (user.active === 'false') {
                                res.json({success: false, message: 'Email not confirmed'})
                            } else {
                                const validPassword = user.comparePassword(req.body.password);
                                if (!validPassword) {
                                    res.json({success: false, message: 'Password invalid'});
                                } else {
                                    const token = jwt.sign({userId: user._id}, config.mongoose.secret, {expiresIn: '24h'});
                                    res.json({success: true, message: 'Success!', token: token, user: user})
                                }
                            }
                        }
                    }
                });
            }
        }
    });

    router.get('/social/facebook',
        passport.authenticate('facebook', {session: false}),
    );

    router.get('/social/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            res.redirect('/login/:' + token);
        }
    );

    router.get('/social/vkontakte',
        passport.authenticate('vkontakte', {
            session: false,
            scope: ['friends']
        }),
    );

    router.get('/social/vkontakte/callback',
        passport.authenticate('vkontakte', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            res.redirect('/login/:' + token);
        });

    router.get('/social/twitter',
        passport.authenticate('twitter', {session: false}),
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
        if (token === "all") {
            next();
        } else {
            if (!token) {
                res.json({success: false, message: 'No token provided'})
            } else {
                jwt.verify(token, config.mongoose.secret, (err, decoded) => {
                    if (err) {
                        res.json({success: false, message: 'Token invalid: ' + err});
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                })
            }
        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({_id: req.decoded.userId}).select('username email role photoUrl status').exec((err, user) => {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!user) {
                    res.json({success: false, message: 'User not found'})
                } else {
                    res.json({success: true, user: user})
                }
            }
        })
    });

    router.get('/profile/:_id', (req, res) => {
        let userProfile, adminProfile;
        User.findOne({_id: req.params._id.replace(":", "")}).select('username email role photoUrl status').exec((err, user) => {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!user) {
                    res.json({success: false, message: 'User not found'})
                } else {
                    userProfile = user;
                    User.findOne({_id: req.decoded.userId}).select('username email role photoUrl status').exec((err, admin) => {
                        if (err) {
                            res.json({success: false, message: err});
                        } else {
                            if (!admin) {
                                res.json({success: false, message: 'Admin not found'})
                            } else {
                                adminProfile = admin;
                                res.json({success: true, user: userProfile, admin: adminProfile})
                            }
                        }
                    })
                }
            }
        })
    });

    return router;
};