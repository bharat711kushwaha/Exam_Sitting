const Student = require("../models/Student");



exports.addSingleStudent = async (req, res) => {
    try {
        const { rollNo, enrollmentNo, semester, branch } = req.body;

        // Validation - Check if all fields are provided
        if (!rollNo || !enrollmentNo || !semester || !branch) {
            return res.status(400).json({ error: "❌ All fields (rollNo, enrollmentNo, semester, branch) are required." });
        }

        // Create and save student
        const newStudent = new Student({ rollNo, enrollmentNo, semester, branch });
        await newStudent.save();

        res.status(201).json({ message: "✅ Student added successfully!" });
    } catch (error) {
        console.error("Single Student Error:", error);
        res.status(500).json({ error: "❌ Failed to add student." });
    }
};

  exports.addBulkStudents = async (req, res) => {
    try {
        console.log("Received Bulk Data:", req.body); // Debugging

        const { students } = req.body; // Extract students from request body

        // If students array is not provided or empty, return error
        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ error: "❌ No students to add." });
        }

        // Validate each student
        for (let student of students) {
            if (!student.rollNo || !student.enrollmentNo || !student.semester ||!student.branch) {
                return res.status(400).json({ error: "❌ Invalid student data format." });
            }
        }

        // Insert multiple students into the database
        await Student.insertMany(students);

        res.status(201).json({ message: `✅ Successfully added ${students.length} students!` });
    } catch (error) {
        console.error("Bulk Add Error:", error);
        res.status(500).json({ error: "❌ Failed to add students in bulk." });
    }
};


exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "❌ Unable to fetch students." });
  }
};
