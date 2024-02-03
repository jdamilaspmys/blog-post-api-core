// routes/posts.js

const express = require('express');
const router = express.Router();
const postsModel = require('../models/posts');
const { successRes, createdRes, notFoundRes, serverErrorRes, forbiddenRes, unauthorizedRes } = require('../utils/response');
const { authenticateToken } = require('../utils/authMiddleware');

// GET all posts
/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     description: Retrieve a list of all posts.
 *     responses:
 *       200:
 *         description: Successful response with the list of posts
 *         content:
 *           application/json:
 *             example:
 *               - _id: "65bcf5fc99dd801dd6362d0a"
 *                 title: "Sample Post 1"
 *                 content: "This is the content of the first sample post."
 *                 author: { _id: "user_id_here", name: "John Doe" }
 *               - _id: "65bcf5fc99dd801dd6362d0b"
 *                 title: "Sample Post 2"
 *                 content: "This is the content of the second sample post."
 *                 author: { _id: "user_id_here", name: "Jane Doe" }
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const posts = await postsModel.getAllPosts();
    successRes(res,posts);
  } catch (error) {
    serverErrorRes(res)
  }
});

// GET a specific post by ID
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get a specific post by ID
 *     description: Retrieve the details of a specific post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to retrieve
 *         schema:
 *           type: string
 *           example: 65bcf5fc99dd801dd6362d0a
 *     responses:
 *       200:
 *         description: Successful response with the details of the post
 *         content:
 *           application/json:
 *             example:
 *               _id: "65bcf5fc99dd801dd6362d0a"
 *               title: "Sample Post"
 *               content: "This is the content of the sample post."
 *               author: { _id: "user_id_here", name: "John Doe" }
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     description: Create a new post with a title and content.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Post"
 *               content:
 *                 type: string
 *                 example: "This is the content of the new post."
 *     responses:
 *       201:
 *         description: Post creation successful
 *         content:
 *           application/json:
 *             example:
 *               _id: "65bcf5fc99dd801dd6362d0a"
 *               title: "New Post"
 *               content: "This is the content of the new post."
 *               author: { _id: "user_id_here", name: "John Doe" }
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Update a post by ID
 *     description: Update the title and content of a specific post by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to update
 *         schema:
 *           type: string
 *           example: 65bcf5fc99dd801dd6362d0a
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post"
 *               content:
 *                 type: string
 *                 example: "This is the updated content of the post."
 *     responses:
 *       200:
 *         description: Post update successful
 *         content:
 *           application/json:
 *             example:
 *               _id: "65bcf5fc99dd801dd6362d0a"
 *               title: "Updated Post"
 *               content: "This is the updated content of the post."
 *               author: { _id: "user_id_here", name: "John Doe" }
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Post not found
 *       403:
 *         description: Forbidden, user does not have permission to update the post
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, async (req, res) => {
  const user = req.user;
  const userId = user._id
  const postId = req.params.id;
  const { title, content } = req.body;
  try {

    const post = await postsModel.getPostById(postId);
    if(!post){
      notFoundRes(res)
    }else if(post && post.author._id.toString() !== userId){
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
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete a post by ID
 *     description: Delete a specific post by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to delete
 *         schema:
 *           type: string
 *           example: 65bcf5fc99dd801dd6362d0a
 *     responses:
 *       200:
 *         description: Post deletion successful
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Post not found
 *       403:
 *         description: Forbidden, user does not have permission to delete the post
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, async (req, res) => {

  const user = req.user;
  const userId = user._id
  const postId = req.params.id;
  try {
    const post = await postsModel.getPostById(postId);
    if(!post){
      notFoundRes(res)
    }else if(post && post.author._id.toString() !== userId){
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
