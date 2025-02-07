const express = require("express");
const router = express.Router();
const { addSingleStudent, addBulkStudents, getStudents } = require("../controllers/studentController");

// ✅ Route to Add Single Student
router.post("/add", addSingleStudent);

// ✅ Route to Add Bulk Students
router.post("/bulk", addBulkStudents);

// ✅ Route to Fetch All Students
router.get("/", getStudents);

module.exports = router;
