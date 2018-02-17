const Fanfic = require('../models/fanfic');

module.exports = (router) => {

    router.post('/saveFanfic', (req, res) => {
        console.log(req.body);
        let fanfic = new Fanfic({
            title: req.body.title,
            description: req.body.description,
            cover: req.body.cover,
            genre: req.body.genre,
            tags: req.body.tags,
            createdBy: req.decoded.userId
        });
        fanfic.save((err) => {
            if(!err) {
                console.log('success');
                res.json({success: true, message: 'success', fanfic: JSON.stringify(fanfic)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.get('/allUserFanfics', (req, res) => {
        Fanfic.find({createdBy: req.decoded.userId}).populate('createdBy').exec(function(err, fanfics) {
            if(!err) {
                res.json({success: true, message: 'success', fanfics: JSON.stringify(fanfics)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/save/fanficChapter', (req, res) => {
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

    return router;
};