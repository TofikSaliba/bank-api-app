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
    minLength: 6,
  },
  passportID: {
    type: String,
    index: true,
    unique: true,
    required: true,
    validate(value) {
      if (value.length !== 10) {
        throw new Error("Passport ID has to be exactly 10 in length!");
      }
    },
  },
  cash: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  accounts: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
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

export { userSchema };
