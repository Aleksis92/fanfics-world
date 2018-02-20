const Fanfic = require('../models/fanfic');

module.exports = (router) => {

    router.post('/save/fanfic', (req, res) => {
        let fanfic = new Fanfic(req.body);
        fanfic.save((err, fanficDB) => {
            if(!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(fanficDB)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/get/allUserFanfics', (req, res) => {
        Fanfic.find({createdBy: req.body._id}).populate('createdBy').exec(function(err, fanfics) {
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
            chapter: req.body.chapter,
            cover: req.body.cover
        };
        console.log(chapter);
        Fanfic.findByIdAndUpdate({_id: req.body.fanficId}, {$push: {fanficChapters: chapter}} ,{new: true}, (err, chapterDB) => {
            if(!err) {
                console.log('DB: ' + chapterDB)
                res.json({success: true, message: 'success', fanfic: JSON.stringify(chapterDB)})
            } else {
                console.log('error: ' + err)
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/update/fanficTitle', (req, res) => {
        let fanfic = new Fanfic(req.body);
        Fanfic.findByIdAndUpdate(req.body._id, {$set: fanfic}, {new: true}, (err, fanficDB) => {
            if(!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(fanficDB)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/update/fanficChapter', (req, res) => {
        let chapter = {
            title: req.body.title,
            chapter: req.body.chapter,
            cover: req.body.cover,
        };
    Fanfic.update({'fanficChapters._id': req.body._id}, {$set: {'fanficChapters.$': chapter}}, {new: true}, (err) => {
            if(!err) {
                res.json({success: true, message: 'success', chapter: JSON.stringify(chapter)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    return router;
};