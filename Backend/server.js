require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const seatingRoutes = require("./routes/seatingRoutes");

connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/students", studentRoutes);
app.use("/api/seating", seatingRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
