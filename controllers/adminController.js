const Article = require('../models/article');
const Admin = require('../models/admin');
const {validationResult} = require('express-validator/check');


exports.login_get = function(req, res, next){
    res.render('login', {title: 'Login'});
    // res.send('You are now on login_get');
}

exports.login_post = function(req, res, next){
    const errors = validationResult(req);

    if(!errors.isEmpty()){return res.render('login',{title: 'Login', errors: errors});}

    Admin.authenticate(req.body.username, req.body.password, (err, user) => {
        if(err){return next(err);}

        req.session.userId = user._id;
        res.redirect('/admin/dashboard');
    })
    // res.send('You are now on login_post');
}

exports.logout_get = function(req, res, next){
    if(req.session && req.session.userId){
        req.session.destroy(err => {
            if(err){return next(err);}
            res.send('You are now logged out!');
        });
    }else res.send('You were not logged in to begin with!');
}

exports.dashboard_get = function(req, res, next){
    res.render('dashboard', {title: 'Dashboard', user: req.user});
    // res.send('You are now on dashboard_get');
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
    if(req.session && req.session.userId){
        Admin.findById(req.session.userId).exec((err, user) => {
            if(err){return next(err);}
            if(!user){return next(new Error('Sorry, user does not exist!'));}
            
            req.user = user;
            return next();
        })
    }
    else res.redirect('/admin');
}