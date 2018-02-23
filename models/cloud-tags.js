const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const fanficSchema = new Schema({
    id: {type: String, required: false, unique: false},
});

const cloudTagsSchema = new Schema({
    value: {type: String, required: false, unique: true},
    fanfic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fanfic'
    },
});

module.exports = mongoose.model('CloudTags', cloudTagsSchema);