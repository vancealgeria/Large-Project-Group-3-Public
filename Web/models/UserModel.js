import mongoose from "mongoose";

// Creating post schema using Mongoose Schema class
const RegisterUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    valid: {
      type: Number,
      required: true,
      default: 1
    },
    weeklyPts: {
      type: Number,
      required: false,
      default: 0
    },
    code: {
      type: Number,
      required: false,
      default: null
    },
    codeTimestamp: {
      type: Date,
      required: false,
      default: null
    },
  },
  { timestamps: true }
);

// Creating a model from schema
const RegisterUser = mongoose.model("RegisterUser", RegisterUserSchema);

export default RegisterUser;
