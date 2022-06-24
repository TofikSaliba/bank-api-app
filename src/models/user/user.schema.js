import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
    immutable: true,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email!");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  passportID: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  cash: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("credit must be a positive number!");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("accounts", {
  ref: "Account",
  localField: "_id",
  foreignField: "owner",
});

export { userSchema };
