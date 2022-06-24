import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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
  usersAccess: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export { accountSchema };
