const timestamps = require('mongoose-timestamp')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    title: {type: String, required: false, unique: false},
    chapter: {type: String, required: false, unique: false},
    cover: {type: String, required: false, unique: false},
});

const tagSchema = new Schema({
    value: {type: String, required: false, unique: false},
    display: {type: String, required: false, unique: false},
});

const fanficSchema = new Schema({
    title: {type: String, required: false, unique: false},
    description: {type: String, required: false, unique: false},
    cover: {type: String, required: false, unique: false, },
    genre: {type: String, required: false,},
    tags: [tagSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fanficChapters: [chapterSchema]
});


fanficSchema.set('autoIndex', false);
chapterSchema.set('autoIndex', false);
tagSchema.set('autoIndex', false);
fanficSchema.plugin(timestamps);
mongoose.model('Fanfic', fanficSchema);
module.exports = mongoose.model('Fanfic', fanficSchema);