const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;


const commentSchema =  new Schema({
    text: {type: String, required: false, unique: false},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fanfic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fanfic'
    },
    likes: [{
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    }],
});


commentSchema.plugin(timestamps);
mongoose.model('Comment', commentSchema);
module.exports = mongoose.model('Comment', commentSchema);