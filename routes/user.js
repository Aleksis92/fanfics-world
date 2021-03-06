const User = require('../models/user');
const Fanfic = require('../models/fanfic');
const Comment = require('../models/comment');

module.exports = (router) => {

    router.post('/saveUser', (req, res) => {
        let user = new User({
            _id: req.body._id,
            username: req.body.username,
            photoUrl: req.body.photoUrl,
            provider: req.body.provider,
            role: req.body.role,
            status: req.body.status
        });
        fanfic.save((err) => {
            if (!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(user)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.get('/allUsers', (req, res) => {
        User.find({}, (err, users) => {
            if (!err) {
                res.json({success: true, message: 'success', users: JSON.stringify(users)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/deleteUsers', (req, res) => {
        let j = true;
        for (user of req.body) {
            User.findByIdAndRemove(user._id, (err) => {
                if (err) { j = false }
                else {
                    Fanfic.remove({createdBy: user._id}, (err) => {
                        if (err) {
                            j = false
                        }
                        else {
                            Comment.remove({createdBy: user._id}, (err) => {
                                if (err) {
                                    j = false
                                }
                            })
                        }
                    })
                }
            })
        }
        if (j === true) {
            res.json({success: true, message: 'success'})
        } else {
            res.json({success: false, message: 'Could not delete user. Error: ', err})
        }
    });

    router.post('/changeUsersStatus', (req, res) => {
        let j = true;
        for (user of req.body.users) {
            User.findByIdAndUpdate(user._id, {$set: {status: req.body.status}}, (err) => {
                if (err) {
                    j = false
                }
            })
        }
        if (j === true) {
            res.json({success: true, message: 'success'})
        } else {
            res.json({success: false, message: 'Could not delete user. Error: ', err})
        }
    });

    router.post('/changeUsersRole', (req, res) => {
        let j = true;
        for (user of req.body.users) {
            User.findByIdAndUpdate(user._id, {$set: {role: req.body.role}}, (err) => {
                if (err) {
                    j = false
                }
            })
        }
        if (j === true) {
            res.json({success: true, message: 'success'})
        } else {
            res.json({success: false, message: 'Could not delete user. Error: ', err})
        }
    });

    router.post('/changeEmail', (req, res) => {
        User.findByIdAndUpdate(req.body._id, {$set: {email: req.body.value}}, (err) => {
            if (!err) {
                res.json({success: true, message: 'Edit email successful'})
            } else {
                res.json({success: false, message: 'Could not update email. Error: ', err})
            }
        })
    });

    router.post('/changeAvatar', (req, res) => {
        User.findByIdAndUpdate(req.body._id, {$set: {cover: req.body.cover}}, (err) => {
            if (!err) {
                res.json({success: true, message: 'Edit avatar successful'})
            } else {
                res.json({success: false, message: 'Could not update avatar. Error: ', err})
            }
        })
    });

    return router;
};