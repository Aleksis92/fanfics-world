const Fanfic = require('../models/fanfic');
const Comment = require('../models/comment');

module.exports = (router) => {

    router.post('/saveComment', (req, res) => {
        let comment = new Comment(req.body);
        comment.save((err) => {
            Comment.populate(comment, {path:'createdBy'}, function(err, commentDB) {
                if (!err) {
                    Fanfic.update({_id: req.body.fanfic}, {$push: {comments: {_id: commentDB._id}}}).exec((err) => {
                        if (!err) {
                            res.json({success: true, message: 'success', comment: JSON.stringify(commentDB)})
                        } else {
                            res.json({success: false, message: 'Could not save user. Error: ', err})
                        }
                    });
                }
            });
        });
    });

    router.post('/like', (req, res) => {
        Comment.findOneAndUpdate({_id: req.body._id}, {$push: {likes: {createdBy: req.body.createdBy}}}, {new: true}, (err, comment) => {
            if (!err) {
                res.json({success: true, message: 'success', comment: JSON.stringify(comment)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });


    router.get('/get/allComments/:fanficId', (req, res) => {
        let fanficId = req.params.fanficId.replace(":", "");
        Comment.find({fanfic: fanficId}).populate('createdBy').exec(function (err, comments) {
            if (!err) {
                res.json({success: true, message: 'success', comments: JSON.stringify(comments)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    return router;
};
