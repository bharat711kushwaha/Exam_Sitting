const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNo: 
  { type: String,
     required: true,
      unique: true 
    },

  enrollmentNo: 
  { type: String,
     required: true, 
     unique: true },
  semester: { 
    type: Number, 
    required: true
     },
     branch: { type: String, required: true }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
