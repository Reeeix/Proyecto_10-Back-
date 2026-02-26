const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const {getEventsForUsers, getEventById, createEvent, updateEvent, addAttendee, getEvents, deleteEvent} = require("../controllers/events");
const upload = require("../../utils/multer");

const eventsRouter = express.Router();


eventsRouter.get("/", getEvents)
eventsRouter.get("/users", isAuth, getEventsForUsers);
eventsRouter.get("/:id", getEventById);



eventsRouter.post("/", isAuth, upload.single("poster"), createEvent);
eventsRouter.put("/:id", isAuth, updateEvent);
eventsRouter.post("/:eventId/attend", isAuth, addAttendee);

module.exports = eventsRouter;