// routes/users.js

const express = require('express');
const bcrypt = require('bcrypt');
const usersModel = require('../models/users');
const { successRes, clientErrorRes, serverErrorRes } = require('../utils/response');

const router = express.Router();

// Sign-up
/**
 * @swagger
 * /users/sign-up:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, password, and name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: User registration successful
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWJjZjVmYzk"
 *               email: "user@example.com"
 *               name: "John Doe"
 *               _id: "65bcf5fc99dd801dd6362d0a"
 *       400:
 *         description: Email is already registered
 *         content:
 *           application/json:
 *             example: "Email is already registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "Internal server error"
 */
router.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body;
  try {

    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return clientErrorRes(res, 'Email is already registered');
    }
  
    const user = await usersModel.createUser({ email, password, name });
    const token = await usersModel.generateAuthToken(user)
    return successRes(res, { token, email, name, _id: user._id }, 201);
  } catch (error) {
    return serverErrorRes(res);
  }
});

// Sign-in
/**
 * @swagger
 * /users/sign-in:
 *   post:
 *     summary: Sign in with existing user credentials
 *     description: Sign in with an existing user account using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Sign-in successful
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWJjZjVmYzk"
 *               email: "user@example.com"
 *               name: "John Doe"
 *               _id: "65bcf5fc99dd801dd6362d0a"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example: "Invalid email or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "Internal server error"
 */
router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersModel.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return clientErrorRes(res, 'Invalid email or password', 401);
    }
    const token = await usersModel.generateAuthToken(user)
    return successRes(res, { token, email, name: user.name, _id: user._id });
  } catch (error) {
    return serverErrorRes(res);
  }
});

module.exports = router;
