const { validationResult } = require('express-validator/check');

const Article = require('../models/article');
module.exports.articles_get = function(req, res, next){
    const articlesPerPage = 2;
    const currentPage = req.query.page || 1;

    //retrieve all article documents, and sort descending by their 'created' property
    Article.find({}).sort({created: 'descending'}).exec((err, articles) => {
        if(err){return next(err);}
        //split array into chunks of 'articlesPerPage'
        const chunked = articles.reduce((chunked, article, currentArticleIndex) => {
            const articlesInChunk = chunked[chunked.length-1].push(article); //returns length on which method was called
            if(articlesInChunk === articlesPerPage && currentArticleIndex!==articles.length-1) 
                chunked.push([]);

            return chunked;
        }, [[]]);

        if(currentPage > chunked.length){return next(new Error('Sorry, page does not exist!'));}

        //passes a chunk pertaining to url query 'page'
        res.render('articles', {title: 'Articles', articles: chunked[currentPage-1], pagination: chunked.length});
    });
}

module.exports.archives_get = function(req, res, next){
    Article.find({}, 'title').sort({created: 'ascending'}).exec((err, articles) => {
        if(err){return next(err);}
        res.render('archives', {title: 'Archives', articles: articles});
    });
}

module.exports.article_get = function(req, res, next){
    Article.findById(req.params.id).exec((err, article) => {
        if(err){return next(err);}
        if(!article){return next(new Error('Sorry, the article does not exist!'));}

        res.render('article', {title: article.title, article: article})
    });
}

module.exports.comment_post = function(req, res, next){
    const errors = validationResult(req);
 
    Article.findById(req.params.id).exec((err, article) => {
        if(err){return next(err);}
        if(!errors.isEmpty()) 
            return res.render('article', {title: article.title, article: article, errors: errors.array()});

        article.comments.push({
            name: req.body.name,
            email: req.body.email,
            body: req.body.body
        });

        article.save(err => {
            if(err){return next(err);}
            res.redirect(article.url);
        });
    });
}