const Fanfic = require('../models/fanfic');
const CloudTags =  require('../models/cloud-tags');

module.exports = (router) => {

    router.post('/save/fanfic', (req, res) => {
        let fanfic = new Fanfic(req.body);
        fanfic.save((err, fanficDB) => {
            for (let tag of req.body.tagCloud) {
                tag.fanfic = fanficDB._id;
                if (tag.action === 'add') {
                    CloudTags.update({value: tag.value}, {$push: {"fanfic": tag.fanfic}}, {upsert: true}, (err) => {})
                }
            }
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

    router.get('/get/lastUpdatedFanfic', (req, res) => {
        Fanfic.find({}).select('title description cover genre tags createdAt').populate('createdBy').sort({updatedAt: -1}).limit(6).exec(function(err, fanfics) {
            if(!err) {
                res.json({success: true, message: 'success', fanfics: JSON.stringify(fanfics)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.get('/get/readableFanfic/:_id', (req, res) => {
        let _id = req.params._id.replace(":", "");
        Fanfic.findOne({_id : _id}).populate('createdBy').exec(function(err, fanfic) {
            if(!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(fanfic)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.get('/get/allTags', (req, res) => {
        CloudTags.find({}, function(err, tags) {
            if(!err) {
                res.json({success: true, message: 'success', tags: JSON.stringify(tags)})
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
        Fanfic.findByIdAndUpdate({_id: req.body.fanficId}, {$push: {fanficChapters: chapter}} ,{new: true}, (err, chapterDB) => {
            if(!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(chapterDB)})
            } else {
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

    router.post('/delete/fanficTitle', (req, res) => {
        Fanfic.findByIdAndRemove(req.body._id, (err) => {
            for (let tag of req.body.tags) {
                CloudTags.update({value: tag.value}, {$pull: {fanfic: req.body._id}}, (err) => {});
            }
            if(!err) {
                res.json({success: true, message: 'success'})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/delete/fanficChapter', (req, res) => {
        Fanfic.update({'fanficChapters._id': req.body._id}, {$pull: {fanficChapters: {_id: req.body._id}}}, (err) => {
            if(!err) {
                res.json({success: true, message: 'success'})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    router.post('/update/cloudTags', (req, res) => {
        for (let tag of req.body) {
            if(tag.action === 'remove') {
                CloudTags.update({value: tag.value}, {$pull: {fanfic: tag.fanfic}}, (err) => {});
            }
            if (tag.action === 'add') {
                CloudTags.update({value: tag.value}, {$push: {"fanfic": tag.fanfic}}, {upsert: true}, (err) => {})
            }
            if(req.body.indexOf(tag)=== req.body.length) {
                res.json({success: true, message: 'success'})
            }
        }
    });

    return router;
};
