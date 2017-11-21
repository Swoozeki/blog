const router = require('express').Router();
const admin_controller = require('../controllers/adminController');
const {body} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

router.get('/', admin_controller.login_get);
router.post('/', admin_controller.login_post);
router.get('/dashboard', admin_controller.require_login, admin_controller.dashboard_get);
router.get('/dashboard/articles', admin_controller.require_login, admin_controller.articles_get);
router.get('/dashboard/articles/create', admin_controller.require_login, admin_controller.create_article_get);
router.post(
    '/dashboard/articles/create',
    [
        body('article-title', 'Title needed for article').isLength({min: 1}),
        body('article-body', 'Body needed for article').isLength({min: 1}),
        sanitizeBody(['article-title', 'article-body']).trim()
    ],
    admin_controller.require_login, 
    admin_controller.create_article_post
);
router.get('/dashboard/article/:id/edit', admin_controller.require_login, admin_controller.edit_article_get);
router.post(
    '/dashboard/article/:id/edit', 
    [
    body('article-title', 'Title needed for article').isLength({min: 1}),
    body('article-body', 'Body needed for article').isLength({min: 1}),
    sanitizeBody(['article-title', 'article-body']).trim()
    ],
    admin_controller.require_login, 
    admin_controller.edit_article_post
);
router.post('/dashboard/article/:id/delete', admin_controller.require_login, admin_controller.delete_article_post);


module.exports = router;