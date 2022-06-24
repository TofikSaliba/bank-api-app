import mongoose from "mongoose";
import validator from "validator";

const accountSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cash: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
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
