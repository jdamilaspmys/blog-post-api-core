// routes/posts.js

const express = require('express');
const router = express.Router();
const postsModel = require('../models/posts');
const { successRes, createdRes, notFoundRes, serverErrorRes } = require('../utils/response');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await postsModel.getAllPosts();
    successRes(res,posts);
  } catch (error) {
    serverErrorRes(res)
  }
});

// GET a specific post by ID
router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postsModel.getPostById(postId);
    successRes(res,post)
  } catch (error) {
    notFoundRes(res)
  }
});

// POST a new post
router.post('/', async (req, res) => {
  const { title, content, author = 'DUMMY_AUTHOR', createdBy, updatedBy } = req.body;
  try {
    const newPost = await postsModel.createPost({
      title,
      content,
      author,
      createdBy : author,
      updatedBy : author,
    });
    createdRes(res,newPost);
  } catch (error) {
    serverErrorRes(res)
  }
});

// PUT (update) a post by ID
router.put('/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content, author, updatedBy } = req.body;
  try {
    const updatedPost = await postsModel.updatePost(postId, {
      title,
      content,
      author,
      updatedBy,
    });
    successRes(res,updatedPost);
  } catch (error) {
    notFoundRes(res)
  }
});

// DELETE a post by ID
router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  const { updatedBy } = req.body;
  try {
    await postsModel.deletePost(postId, updatedBy);
    successRes(res);
  } catch (error) {
    notFoundRes(res);
  }
});

module.exports = router;
