const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

// get all published posts - non-protected route
router.get('/',  postController.list_published_post)

// get all unpublished posts - protected route
router.get('/unpublished',  postController.list_unpublished_post)

// get all posts - protected route
router.get('/all', postController.list_post)

// get a specific post - should be protected if unpublished????????
// ?????
router.get('/:postId', postController.display_post)

// create new post - protected route
router.post('/', postController.create_post)

// update a post - protected route
// change ID to slug!!!
router.put('/:postId/update', postController.update_post)

// publish or unpublish a post - protected route
// change ID to slug!!!
router.put('/:postId/publish', postController.publish_post)

module.exports = router