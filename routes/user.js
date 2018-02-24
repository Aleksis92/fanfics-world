const User = require('../models/user');

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
            if(!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(user)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.get('/allUsers', (req, res) => {
        User.find({}, (err, users) => {
            if(!err) {
                res.json({success: true, message: 'success', users: JSON.stringify(users)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });


    router.post('/save/chapter', (req, res) => {
        let chapter = {
            title: req.body.title,
            chapter: req.body.chapter
        };
        Fanfic.findOneAndUpdate({title: "f"}, {$push: {fanficChapters: chapter}} ,(err) => {
            if(!err) {
                res.json({success: true, message: 'success'})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/deleteUsers', (req, res) => {
        let j = true;
        for (user of req.body ) {
            User.findByIdAndRemove(user._id, (err) => {
                if (err) { j = false }
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
        for (user of req.body.users ) {
            User.findByIdAndUpdate(user._id, {$set: {status: req.body.status}}, (err) => {
                if (err) { j = false }
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
        for (user of req.body.users ) {
            User.findByIdAndUpdate(user._id, {$set: {role: req.body.role}}, (err) => {
                if (err) { j = false }
            })
        }
        if (j === true) {
            res.json({success: true, message: 'success'})
        } else {
            res.json({success: false, message: 'Could not delete user. Error: ', err})
        }
    });

    return router;
};