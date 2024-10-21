const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const uniqueValidator = require("mongoose-unique-validator");
const config = require("../config");

const { customAlphabet } = require("nanoid");
const { type } = require("os");
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

const UserSchema = new mongoose.Schema(
  {
    // General Info
    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    authType: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    otp: { type: Number },
    isOtpVerified: { type: Boolean, default: false },
    otpExpires: { type: Date, default: null },

    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    currency: { type: String, default: "GBP" },
    hash: { type: String, default: null },
    salt: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "Taken" });
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.validPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.setOTP = function () {
  this.otp = Math.floor(100000 + Math.random() * 9000);
  this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    },
    config.secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    otp: this.otp,
    authType: this.authType,
    otp: this.otp,
    status: this.status,
    token: this.generateJWT(),
  };
};

UserSchema.methods.toJSON = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    status: this.status,
    currency: this.currency,
    role: this.role,
  };
};

module.exports = mongoose.model("User", UserSchema);
