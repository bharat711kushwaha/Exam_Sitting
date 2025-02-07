const SeatingPlan = require("../models/SeatingPlan");
const Student = require("../models/Student");
const ExcelJS = require("exceljs");

exports.generateSeating = async (req, res) => {
    try {
      const { desks, semesters, branches, studentsPerDesk } = req.body;

      // Fetch students filtered by semester & branch
      const students = await Student.find({ 
        semester: { $in: semesters },
        branch: { $in: branches }
      });

      if (students.length === 0) {
        return res.status(400).json({ error: "❌ No students found for the selected semesters & branches." });
      }

      let groupedStudents = {};

      //  Group students strictly by last two digits
      students.forEach(student => {
        let rollNo = student.rollNo.toString();
        let lastTwoDigits = rollNo.slice(-2);
        let groupKey = `${lastTwoDigits}`; // Only last two digits matter

        if (!groupedStudents[groupKey]) {
          groupedStudents[groupKey] = [];
        }
        groupedStudents[groupKey].push({ rollNo: student.rollNo, branch: student.branch });
      });

      // Convert object to array & sort by largest groups first
      let studentGroups = Object.values(groupedStudents).sort((a, b) => b.length - a.length);

      let seatingPlan = [];
      let deskCounter = 0;

      //  Strictly ensure last two digits match at each desk
      for (let group of studentGroups) {
        while (group.length > 0) {
          if (!seatingPlan[deskCounter]) seatingPlan[deskCounter] = { students: [], branch: "" };

          let spaceLeft = studentsPerDesk - seatingPlan[deskCounter].students.length;
          let toSeat = group.splice(0, spaceLeft); 

          if (seatingPlan[deskCounter].students.length > 0) {
            // Ensure last two digits match
            let existingLastTwo = seatingPlan[deskCounter].students[0].toString().slice(-2);
            let newLastTwo = toSeat[0].rollNo.toString().slice(-2);
            if (existingLastTwo !== newLastTwo) {
              break; // Skip if the last two digits don't match
            }
          }

          seatingPlan[deskCounter].students.push(...toSeat.map(s => s.rollNo));
          seatingPlan[deskCounter].branch = toSeat.length > 0 ? toSeat[0].branch : seatingPlan[deskCounter].branch;

          if (seatingPlan[deskCounter].students.length === studentsPerDesk) {
            deskCounter++;
            if (deskCounter >= desks) break;
          }
        }
        if (deskCounter >= desks) break;
      }

      const newPlan = new SeatingPlan({ 
        desks, 
        semesters, 
        arrangement: seatingPlan.map(desk => ({ students: desk.students, branch: desk.branch })) 
      });

      await newPlan.save();
      
      res.status(201).json({ message: "✅ Seating plan generated successfully!", seatingPlan });
    } catch (error) {
      console.error("Error generating seating plan:", error);
      res.status(500).json({ error: "❌ Error generating seating plan.", details: error.message });
    }
};
exports.exportSeating = async (req, res) => {
  try {
    const seatingPlan = await SeatingPlan.findOne().sort({ createdAt: -1 });
    if (!seatingPlan) return res.status(404).json({ error: "❌ No seating plan found." });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Seating Arrangement");

    worksheet.addRow(["Desk No", "Students"]);
    seatingPlan.arrangement.forEach((students, index) => {
      worksheet.addRow([index + 1, students.join(", ")]);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=seating.xlsx");

    await workbook.xlsx.write(res);
    await res.end(); // Ensure response ends correctly

  } catch (error) {
    console.error("Error exporting seating plan:", error);
    res.status(500).json({ error: "❌ Error exporting seating plan.", details: error.message });
  }
};
