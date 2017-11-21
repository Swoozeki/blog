const mongoose = require('mongoose');
const ArticleSchema = mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    created: {type: Date, default: Date.now},
    comments: [{
        name: {type: String, required: true},
        email: {type: String},
        body: {type: String, required: true}
    }]
});

ArticleSchema
.virtual('excerpt')
.get(function(){
    return `${this.body.split(' ').slice(0, 10).join(' ')} ...`;
});

ArticleSchema
.virtual('created-formatted')
.get(function(){
    const moment = require('moment');
    return moment().format('MMMM Do, YYYY');
});


ArticleSchema
.virtual('url')
.get(function(){
    return `/article/${this._id}`;
})


module.exports = mongoose.model('Article', ArticleSchema);