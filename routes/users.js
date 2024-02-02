// routes/users.js

const express = require('express');
const bcrypt = require('bcrypt');
const usersModel = require('../models/users');
const { successRes, clientErrorRes, serverErrorRes } = require('../utils/response');

const router = express.Router();

// Sign-up
router.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body;
  try {

    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return clientErrorRes(res, 'Email is already registered');
    }
  
    const user = await usersModel.createUser({ email, password, name });
    const token = await usersModel.generateAuthToken(user)
    return successRes(res, { token, email, name }, 201);
  } catch (error) {
    return serverErrorRes(res);
  }
});

// Sign-in
router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersModel.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return clientErrorRes(res, 'Invalid email or password', 401);
    }
    const token = await usersModel.generateAuthToken(user)
    return successRes(res, { token, email, name: user.name });
  } catch (error) {
    return serverErrorRes(res);
  }
});

module.exports = router;
