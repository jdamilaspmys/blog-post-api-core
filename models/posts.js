// models/posts.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const postSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
},
{
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
    getAllPosts: async (page = 1, size = 5) => {
      const skip = (page - 1) * size;
      return Post.find({ isDelete: false }).skip(skip).limit(size)
    },

    getPostById: async (postId) => {
      return Post.findOne({ _id: postId, isDelete: false });
    },

    createPost: async ({ title, content, author }) => {
      const newPost = new Post({
        title,
        content,
        author,
        createdBy : author,
        updatedBy : author,
      });

      await newPost.save();

      return newPost;
    },

    updatePost: async (postId, { title, content }) => {
      const post = await Post.findOne({ _id: postId, isDelete: false });

      if (!post) {
        throw new Error('Post not found');
      }

      post.title = title || post.title;
      post.content = content || post.content;

      await post.save();
      return post;
    },

    deletePost: async (postId, userId) => {
      const post = await Post.findOne({ _id: postId, isDelete: false });

      if (!post) {
        throw new Error('Post not found');
      }

      post.isDelete = true;
      post.updatedBy = userId;

      await post.save();
      return { message: 'Post marked as deleted successfully' };
    },
  };
