// controllers/events.js
const Event = require("../models/events");

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().select("-attendees"); 

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al obtener eventos");
  }
};

const getEventsForUsers = async (req, res, next) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate("attendees", "userName")
      .populate("createdBy", "userName");

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al obtener eventos");
  }
};


const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate(
      "attendees",
      "userName email"
    );

    if (!event) return res.status(404).json("Evento no encontrado");

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al obtener el evento");
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { eventName, date, description, location, poster } = req.body;

    const posterPath = req.file ? `/uploads/${req.file.filename}` : "";

    const newEvent = new Event({
      eventName,
      date,
      description,
      location,
      poster: posterPath,
      createdBy: req.user._id
    });

    const event = await newEvent.save();
    return res.status(201).json(event);
  } catch (error) {
    console.error(error);
    return res.status(400).json("Error al crear el evento:" + error);
  }
};


const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json("Evento no encontrado");
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json("No tienes permiso para actualizar este evento");
    }

    const updatedData = req.body;

    if (req.file) {
      updatedData.poster = `/uploads/${req.file.filename}`;
    }
    const eventUpdated = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json(eventUpdated);
  } catch (error) {
    console.error(error);
    return res.status(400).json("Error al actualizar el evento");
  }
};


const addAttendee = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json("Evento no encontrado");

    const alreadyJoined = event.attendees.some(
      (attendee) => attendee.toString() === userId.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json("Ya confirmaste asistencia a este evento");
    }

    event.attendees.push(userId);
    await event.save();

    const populatedEvent = await Event.findById(eventId)
      .populate("attendees", "userName email")
      .populate("createdBy", "userName");

    return res.status(200).json({
      message: "Asistencia confirmada",
      event: populatedEvent,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json("Error al confirmar asistencia");
  }
};


module.exports = {
  getEvents,
  getEventsForUsers,
  getEventById,
  createEvent,
  updateEvent,
  addAttendee
};