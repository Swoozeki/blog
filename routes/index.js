const router = require('express').Router();
const article_controller = require('../controllers/articleController');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

router.get('/', article_controller.articles_get);

router.get('/archives', article_controller.archives_get);

router.get('/article/:id', article_controller.article_get);

router.post(
    '/article/:id/comment', 
    [
        body('name', 'name must not  be empty!').isLength({min: 1}),
        body('email', 'email must not be empty!').isLength({min: 1}),
        body('body', 'comment field must not be empty!').isLength({min: 1}),
        sanitizeBody(['name', 'email', 'body']).escape().trim()
    ],
    article_controller.comment_post
);

const admin = require('./admin');
router.use('/admin/', admin);

module.exports = router;