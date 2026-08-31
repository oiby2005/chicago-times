const express = require('express');
const router = express.Router();
const { getPosts, savePost, deletePost } = require('../controllers/postController');

router.get('/', getPosts);
router.post('/', savePost);
router.delete('/:id', deletePost);

module.exports = router;
