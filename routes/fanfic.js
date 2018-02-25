const Fanfic = require('../models/fanfic');
const CloudTags = require('../models/cloud-tags');

module.exports = (router) => {

    router.post('/save/fanfic', (req, res) => {
        let fanfic = new Fanfic(req.body);
        fanfic.save((err, fanficDB) => {
            addToCloudTag(req.body, fanficDB);
            if (!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(fanficDB)})
            } else {
                res.json({success: false, message: 'Could not save user. Error: ', err})
            }
        });
    });

    function addToCloudTag(body, fanficDB) {
        for (let tag of body.tagCloud) {
            tag.fanfic = fanficDB._id;
            if (tag.action === 'add') {
                CloudTags.update({value: tag.value}, {$push: {"fanfic": tag.fanfic}}, {upsert: true}, (err) => {
                    if (err) {
                        res.json({success: false, message: 'Could not save tags to tag cloud. Error: ', err})
                    }
                })
            }
        }
    }

    router.post('/get/allUserFanfics', (req, res) => {
        Fanfic.find({createdBy: req.body._id}).populate('createdBy').exec(function (err, fanfics) {
            if (!err) {
                res.json({success: true, message: 'success', fanfics: JSON.stringify(fanfics)})
            } else {
                res.json({success: false, message: 'Could not get all user fanfics. Error: ', err})
            }
        });
    });

    router.get('/get/lastUpdatedFanfics', (req, res) => {
        Fanfic.find({}).select('title description cover genre tags updatedAt rating').populate('createdBy').sort({updatedAt: -1}).limit(6).exec(function (err, fanfics) {
            if (!err) {
                res.json({success: true, message: 'success', fanfics: JSON.stringify(fanfics)})
            } else {
                res.json({success: false, message: 'Could not get last updated fanfics. Error: ', err})
            }
        });
    });

    router.get('/search/tag/:tag', (req, res) => {
        let tag = req.params.tag.replace(":", "");
        CloudTags.findOne({value: tag}).populate('fanfic').exec(function (err, fanficsDB) {
            if (!err) {
                if (fanficsDB) {
                    let fanfics = iterateResponseFanfic(fanficsDB);
                    res.json({success: true, message: 'success', fanfics: JSON.stringify(fanfics, res)})
                } else {
                    res.json({success: false, message: 'Could not search tag fanfics. Error: ', err})
                }
            } else {
                res.json({success: false, message: 'Could not search tag fanfics. Error: ', err})
            }
        });
    });

    function iterateResponseFanfic(fanficsDB) {
        let responseFanfics = [];
        for (let fanfic of fanficsDB.fanfic) {
            fanfic.fanficChapters = undefined;
            responseFanfics.push(fanfic);
        }
        return responseFanfics
    }

    router.get('/get/topFanfics', (req, res) => {
        Fanfic.find({}).select('title description cover genre tags updatedAt rating').populate('createdBy').sort({rating: -1}).limit(6).exec(function (err, fanfics) {
            if (!err) {
                res.json({success: true, message: 'success', fanfics: JSON.stringify(fanfics)})
            } else {
                res.json({success: false, message: 'Could not get top fanfics. Error: ', err})
            }
        });
    });

    router.get('/get/searchFanfic/:search', (req, res) => {
        let search = req.params.search.replace(":", "");
        Fanfic.collection.indexes(function (error, indexes) {
            console.log(indexes)
        })
        Fanfic.find({$text: {$search: search}}).exec(function (err, fanfics) {
            console.log(fanfics);
            if (!err) {
                res.json({success: true, message: 'success', fanfics: JSON.stringify(fanfics)})
            } else {
                res.json({success: false, message: 'Could not get top fanfics. Error: ', err})
            }
        });
    });

    router.post('/set/rating', (req, res) => {
        Fanfic.findOneAndUpdate({'fanficChapters._id': req.body.fanficChapterId}, {$push: {'fanficChapters.$.rating': req.body}}, {new: true}, (err, fanficDB) => {
            if (!err) {
                let averageRating = calculateAverageRating(fanficDB);
                Fanfic.update({'fanficChapters._id': req.body.fanficChapterId}, {$set: {rating: averageRating}}, (err) => {
                    if (!err) {
                        res.json({success: true, message: 'success'})
                    } else {
                        res.json({success: false, message: 'Could not set rating. Error: ', err})
                    }
                });
            }
        });
    });

    function calculateAverageRating(fanfic) {
        let counterRatings = 0;
        let summaryRating = 0;
        for (let chapter of fanfic.fanficChapters) {
            for (let rating of chapter.rating) {
                console.log('itr');
                counterRatings++;
                summaryRating += rating.number;
            }
        }
        return summaryRating / counterRatings;
    }

    router.get('/get/readableFanfic/:_id', (req, res) => {
        let _id = req.params._id.replace(":", "");
        Fanfic.findOne({_id: _id}).populate('createdBy').exec(function (err, fanfic) {
            if (!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(fanfic)})
            } else {
                res.json({success: false, message: 'Could not get readable fanfic. Error: ', err})
            }
        });
    });

    router.get('/get/cloudTags', (req, res) => {
        CloudTags.find({}).populate({path: 'fanfic'}).exec((err, tags) => {
            if (!err) {
                res.json({success: true, message: 'success', tags: JSON.stringify(tags)})
            } else {
                res.json({success: false, message: 'Could not get cloud tags. Error: ', err})
            }
        });
    });

    router.post('/save/fanficChapter', (req, res) => {
        Fanfic.findByIdAndUpdate({_id: req.body.fanficId}, {$push: {fanficChapters: req.body}}, {new: true}, (err, chapterDB) => {
            if (!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(chapterDB)})
            } else {
                res.json({success: false, message: 'Could not save fanfic chapter. Error: ', err})
            }
        });
    });

    router.post('/update/fanficTitle', (req, res) => {
        let fanfic = new Fanfic(req.body);
        Fanfic.findByIdAndUpdate(req.body._id, {$set: fanfic}, {new: true}, (err, fanficDB) => {
            if (!err) {
                res.json({success: true, message: 'success', fanfic: JSON.stringify(fanficDB)})
            } else {
                res.json({success: false, message: 'Could not update fanfic title. Error: ', err})
            }
        });
    });

    router.post('/update/fanficChapter', (req, res) => {
        Fanfic.update({'fanficChapters._id': req.body._id}, {$set: {'fanficChapters.$': req.body}}, {new: true}, (err) => {
            if (!err) {
                res.json({success: true, message: 'success', chapter: JSON.stringify(chapter)})
            } else {
                res.json({success: false, message: 'Could not update fanfic chapter. Error: ', err})
            }
        });
    });

    router.post('/delete/fanficTitle', (req, res) => {
        Fanfic.findByIdAndRemove(req.body._id, (err) => {
            for (let tag of req.body.tags) {
                CloudTags.update({value: tag.value}, {$pull: {fanfic: req.body._id}}, (err) => {
                });
            }
            if (!err) {
                res.json({success: true, message: 'success'})
            } else {
                res.json({success: false, message: 'Could not delete fanfic title. Error: ', err})
            }
        });
    });

    router.post('/delete/fanficChapter', (req, res) => {
        Fanfic.update({'fanficChapters._id': req.body._id}, {$pull: {fanficChapters: {_id: req.body._id}}}, (err) => {
            if (!err) {
                res.json({success: true, message: 'success'})
            } else {
                res.json({success: false, message: 'Could not delete fanfic chapter. Error: ', err})
            }
        });
    });

    router.post('/update/cloudTags', (req, res) => {
        for (let tag of req.body) {
            if (tag.action === 'remove') {
                CloudTags.update({value: tag.value}, {$pull: {fanfic: tag.fanfic}}, (err) => {
                });
            }
            if (tag.action === 'add') {
                CloudTags.update({value: tag.value}, {$push: {"fanfic": tag.fanfic}}, {upsert: true}, (err) => {
                })
            }
            if (req.body.indexOf(tag) === req.body.length) {
                res.json({success: true, message: 'success'})
            }
        }
    });

    return router;
};
