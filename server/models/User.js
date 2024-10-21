const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const uniqueValidator = require("mongoose-unique-validator");
const config = require("../config");

const { customAlphabet } = require("nanoid");
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
    phone: {
      type: String,
      unique: true,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },

    // Auth Controls
    role: { type: String, enum: ["admin", "patient", "provider"] },
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

    hash: { type: String, default: null },
    salt: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "Taken" });
UserSchema.plugin(mongoosePaginate);

UserSchema.pre("save", function (next) {
  if (!this.centrusId) {
    this.centrusId = nanoid();
  }
  next();
});

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

UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const tokenExpiry = Date.now() + 1800000; // 30 minutes
  this.resetPasswordToken = {
    value: resetToken,
    expires: tokenExpiry,
  };
};

UserSchema.methods.genMailTokenForVerification = function () {
  const mailToken = crypto.randomBytes(20).toString("hex");
  const tokenExpiry = Date.now() + 1800000; // 30 minutes
  this.mailToken = {
    value: mailToken,
    expires: tokenExpiry,
  };
};

UserSchema.methods.genMailTokenForJoin = function () {
  const mailToken = crypto.randomBytes(20).toString("hex");
  // create tokenExpiry w unlimited expiry
  const tokenExpiry = null;
  this.mailToken = {
    value: mailToken,
    expires: tokenExpiry,
  };
};

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      company: this.company,
      role: this.role,
      exp: parseInt(exp.getTime() / 1000),
    },
    config.secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    role: this.role,
    otp: this.otp,
    authType: this.authType,
    otp: this.otp,
    phone: this.phone,
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
    phone: this.phone,
    role: this.role,
  };
};

module.exports = mongoose.model("User", UserSchema);
