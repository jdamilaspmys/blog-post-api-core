// models/users.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, validate: { validator: isEmailValid, message: 'Invalid email format' } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function isEmailValid(email) {
  // Simple email validation
  return /\S+@\S+\.\S+/.test(email);
}

userSchema.statics.getUserByEmail = async function (email) {
    return this.findOne({ email, isDelete: false });
  };
  
  userSchema.statics.createUser = async function ({ email, password, name }) {
    const user = new this({
      email,
      password,
      name,
    });
    await user.save();
    return user;
  };

  userSchema.statics.generateAuthToken = function (user) {
    
    const token = jwt.sign(
        { _id: user._id.toString(), name: user.name, email: user.email }, 
        process.env.JWT_SECRET_KEY,
        { expiresIn: 24 * 60 * 60 } // ExpiresIn 24 Hours
    );

    return token;
  };

userSchema.pre('save', async function (next) {
  const user = this;

  // Hash the password only if it is modified or new
  if (!user.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // Set the hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
