import mongoose from "mongoose";

// Creating post schema using Mongoose Schema class
const ActivitySchema = new mongoose.Schema({
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RegisterUser',
      required: true,
      default: 1
    },
    recordedDailyWorkMinutes: {
      type: Number,
      required: true,
      default: 0
    },
    recordedDailyLeisureMinutes: {
      type: Number,
      required: true,
      default: 0
    },
    recordedDailySleepMinutes: {
      type: Number,
      required: true,
      default: 0
    },
    recordTimestamp: {
      type: Date,
      required: true,
      default: null
    },
    totalDailyPts: {
      type: Number,
      required: true,
      default: 0
    },
  },
  { timestamps: true })


// Creating a model from schema
const Activity = mongoose.model("Activity", ActivitySchema)

export default Activity