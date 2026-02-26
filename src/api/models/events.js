const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },

    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],

    createdBy: {type: mongoose.Schema.Types.ObjectId,ref: "users",required: true},

    poster: { type: String },
  },
  { timestamps: true }
);


const Event = mongoose.model("events", eventSchema, "events");
module.exports = Event;