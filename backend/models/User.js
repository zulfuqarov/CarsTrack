const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ad daxil edilməlidir'],
    trim: true,
    maxlength: [50, 'Ad 50 simvoldan çox ola bilməz'],
  },
  email: {
    type: String,
    required: [true, 'Email daxil edilməlidir'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Düzgün email daxil edin',
    ],
  },
  password: {
    type: String,
    required: [true, 'Şifrə daxil edilməlidir'],
    minlength: [6, 'Şifrə ən azı 6 simvol olmalıdır'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    return jwt.sign(
      { id: this._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '30d'
      }
    );
  } catch (error) {
    console.error('JWT signing error:', error);
    throw error;
  }
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 