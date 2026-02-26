require("dotenv").config();
const express = require("express");
const path = require("path"); // <--- añadir path
const { connectDB } = require("./src/config/db");
const usersRouter = require("./src/api/routes/users");
const cors = require("cors");
const eventsRouter = require("./src/api/routes/events");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/events", eventsRouter);

app.use((req, res) => {
    return res.status(404).json("Route Not Found");
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});