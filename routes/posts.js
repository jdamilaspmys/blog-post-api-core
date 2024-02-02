// routes/posts.js

const express = require('express');
const router = express.Router();
const postsModel = require('../models/posts');
const { successRes, createdRes, notFoundRes, serverErrorRes, forbiddenRes, unauthorizedRes } = require('../utils/response');
const { authenticateToken } = require('../utils/authMiddleware');

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
    if(!post){  
      notFoundRes(res)
    }else{
      successRes(res,post)
    }
  } catch (error) {
    serverErrorRes(res)
  }
});

// POST a new post
router.post('/', authenticateToken, async (req, res) => {

  const user = req.user
  const { title, content } = req.body;
  const userId = user._id;
  try {
    const newPost = await postsModel.createPost({
      title,
      content,
      author : userId
    });
    createdRes(res,newPost);
  } catch (error) {
    serverErrorRes(res)
  }
});

// PUT (update) a post by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const user = req.user;
  const userId = user._id
  const postId = req.params.id;
  const { title, content } = req.body;
  try {

    const post = await postsModel.getPostById(postId);
    if(!post){
      notFoundRes(res)
    }else if(post && post.author !== userId){
      unauthorizedRes(res)
    }else {
      const updatedPost = await postsModel.updatePost(postId, {
        title,
        content,
      });
      successRes(res,updatedPost);
    }
  } catch (error) {
    notFoundRes(res)
  }
});

// DELETE a post by ID
router.delete('/:id', authenticateToken, async (req, res) => {

  const user = req.user;
  const userId = user._id
  const postId = req.params.id;
  try {
    const post = await postsModel.getPostById(postId);
    if(!post){
      notFoundRes(res)
    }else if(post && post.author !== userId){
      unauthorizedRes(res)
    }else {
      await postsModel.deletePost(postId, userId);
      successRes(res);
    }
  } catch (error) {
    notFoundRes(res);
  }
});

module.exports = router;
