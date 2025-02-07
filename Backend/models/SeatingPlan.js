const mongoose = require("mongoose");

const seatingSchema = new mongoose.Schema({
  desks: { type: Number, required: true },
  semesters: [Number], // Allowed semesters for seating
  arrangement: [
    {
      students: [String], // Array of student roll numbers
      branch: String
    } ]
}, { timestamps: true });

module.exports = mongoose.model("SeatingPlan", seatingSchema);
