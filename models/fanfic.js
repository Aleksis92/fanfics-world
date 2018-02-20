const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    title: {type: String, required: false, unique: false},
    chapter: {type: String, required: false, unique: false},
    cover: {type: String, required: false, unique: false},
})

const fanficSchema = new Schema({
    title: {type: String, required: false, unique: false},
    description: {type: String, required: false, unique: false},
    cover: {type: String, required: false, unique: false, },
    genre: {type: String, required: false,},
    tags: {type: String, required: false},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fanficChapters: [chapterSchema]
});

fanficSchema.set('autoIndex', false);
chapterSchema.set('autoIndex', false);

module.exports = mongoose.model('Fanfic', fanficSchema);