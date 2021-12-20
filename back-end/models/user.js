const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Team = require("./team");

const userSchema = new Schema({
  role: {
    type: String,
    // default: "admin",
  },
  isAdmin: Boolean,
  isManager: Boolean,
  company: String,
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },

  email: {
    type: String,
  },
  password: {
    type: String,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  team: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  // employees: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // }],
  settings: {
    ScreenShotPerHour: Number,
    AllowBlur: Boolean,
    AppsAndUrlTracking: Boolean,
    WeeklyTimeLimit: Number,
    AutoPause: Number,
    OfflineTime: Boolean,
    NotifyUser: Boolean,
    WeekStart: String,
    CurrencySymbol: String,
  },
  pay: Number,

  days: [
    {
      date: Date,
      hours: Number,
      timeRange: [
        {
          startTime: Date,
          endTime: Date,
          activityLevelTotal: Number,
          screenShots: [
            {
              activityLevel: Number,
              url: String,
              time: Date,
              taskName: String,
            },
          ],
        },
      ],
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
