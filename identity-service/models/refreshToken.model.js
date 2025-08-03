const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: [true, 'Token is required']
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
module.exports = RefreshToken;