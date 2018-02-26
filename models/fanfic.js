const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    title: {type: String, required: true},
    chapter: {type: String, required: false},
    cover: {type: String, required: false},
    rating: [{
        number: {type: Number, required: false, default: 0},
        createdBy: {type: String, required: false},
    }]
});

const tagSchema = new Schema({
    value: {type: String, required: false},
    display: {type: String, required: false},
});

const fanficSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    cover: {type: String, required: true},
    genre: {type: String, required: true,},
    tags: [tagSchema],
    rating: {type: Number, required: false,},
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fanficChapters: [chapterSchema]
}).index({'$**': 'text'});

fanficSchema.on('error', function (errorE) {
    console.log('---> index error: ', errorE);
});

fanficSchema.on('index', function (errI) {
    console.log('----> new index creating', errI);
});


fanficSchema.plugin(timestamps);
mongoose.model('Fanfic', fanficSchema);
module.exports = mongoose.model('Fanfic', fanficSchema);