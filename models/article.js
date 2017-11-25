const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String},
    body: {type: String, required: true}
});

CommentSchema
.virtual('escaped-comment-body')
.get(function(){
    // console.log('Hello!');
    return validator.unescape(this.body);
});

const ArticleSchema = mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    created: {type: Date, default: Date.now},
    comments: [CommentSchema]
});

const validator = require('validator');
const marked = require('marked');

ArticleSchema
.virtual('escaped-body')
.get(function(){
    return validator.unescape(this.body);
});

ArticleSchema
.virtual('marked-excerpt')
.get(function(){
    /*
        first unescape the text from database, 
        then parse markdown syntax to HTML, making sure its sanitized to XSS
    */
    return marked(validator.unescape(`${this.body.split(' ').slice(0, 10).join(' ')} ...`),{
        sanitize: true
    });
});

ArticleSchema
.virtual('marked-body')
.get(function(){
    return marked(validator.unescape(this.body),{
        sanitize: true
    });
});

ArticleSchema
.virtual('created-formatted')
.get(function(){
    const moment = require('moment');
    return moment(this.created).format('MMMM Do, YYYY');
});


ArticleSchema
.virtual('url')
.get(function(){
    return `/article/${this._id}`;
})


module.exports = mongoose.model('Article', ArticleSchema);