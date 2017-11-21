const Article = require('../models/article');
const {validationResult} = require('express-validator/check');


exports.login_get = function(req, res, next){
    res.send('You are now on login_get');
}

exports.login_post = function(req, res, next){
    res.send('You are now on login_post');
}

exports.dashboard_get = function(req, res, next){
    res.send('You are now on dashboard_get');
}

exports.articles_get = function(req, res, next){
    res.send('You are now on articles_get');
}

exports.create_article_get = function(req, res, next){
    res.render('article_form', {title: 'Create new article', url: req.path});
    // res.send('You are now on create_article_get page!');
}

exports.create_article_post = function(req, res, next){
    const article = new Article({
        title: req.body['article-title'],
        body: req.body['article-body'],
        comments: []
    });

    const errors = validationResult(req);

    if(!errors.isEmpty()) 
        return res.render('article_form', {title: 'Create new article', url: req.path, errors: errors.array()})
    
    article.save(err => {
        console.log('trying to save article...');
        if(err){return next(err);}
        return res.send('You successfully posted an article');
    });
}


exports.edit_article_get = function(req, res, next){
    Article.findById(req.params.id).exec((err, article) => {
        if(err){return next(err);}
        res.render('article_form', {title: 'Edit article', url: req.path, article: article});
    });
    // res.send('You are now on edit_article_get');
}

exports.edit_article_post = function(req, res, next){
    Article.findByIdAndUpdate(req.params.id, 
        {title: req.body['article-title'], body: req.body['article-body']})
    .exec(err => {
        if(err){return next(err);}
        res.redirect('/admin/dashboard/articles');
    });
    // res.send('You are now on edit_article_post');
}

exports.delete_article_post = function(req, res, next){
    Article.findByIdAndRemove(req.params.id)
    .exec(err => {
        if(err){return next(err);}
        res.redirect('/admin/dashboard/articles');
    });
    // res.send('You are now on delete_article_post');
}

exports.require_login = function(req, res, next){
    next();
}