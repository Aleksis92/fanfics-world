const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

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
    fanficChapters: [{
        title: {type: String, required: false, unique: false},
        chapter: {type: String, required: false, unique: false},
    }]
});


module.exports = mongoose.model('Fanfic', fanficSchema);