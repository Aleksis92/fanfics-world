const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
mongoose.set('debug', true);

const cloudTagsSchema = new Schema({
    value: {type: String, required: false, unique: true},
    fanfic: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fanfic'
    }],
});


module.exports = mongoose.model('CloudTags', cloudTagsSchema);