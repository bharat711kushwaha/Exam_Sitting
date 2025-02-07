import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import * as XLSX from "xlsx"; // Excel/CSV parsing ke liye

function AddStudent() {
  const [student, setStudent] = useState({ rollNo: "", enrollmentNo: "", semester: "", branch: "" });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student.rollNo || !student.enrollmentNo || !student.semester || !student.branch) {
      setMessage("❌ All fields are required.");
      return;
    }

    try {
      // ✅ API call with branch included
      const res = await axios.post("http://localhost:5000/api/students/add", student);
      setMessage(res.data.message);
      setStudent({ rollNo: "", enrollmentNo: "", semester: "", branch: "" });
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      setMessage("❌ Error adding student.");
    }
  };

  // 📂 File Upload and Parsing Function
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log("Extracted Data:", data);

      // ✅ Ensure data includes branch
      const formattedData = data.map(student => ({
        rollNo: student.rollNo,
        enrollmentNo: student.enrollmentNo,
        semester: student.semester,
        branch: student.branch || "Unknown", // Default in case branch is missing
      }));

      axios.post("http://localhost:5000/api/students/bulk", { students: formattedData })
        .then((res) => setMessage(res.data.message))
        .catch((error) => setMessage("❌ Error adding students in bulk."));
    };
    reader.readAsBinaryString(uploadedFile);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto mt-12"
    >
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add New Student</h2>
      
      {message && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className={`p-4 rounded-lg text-center ${message.includes("✅") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
        >
          {message}
        </motion.p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
        <motion.input 
          whileFocus={{ scale: 1.05 }} 
          whileHover={{ scale: 1.02 }} 
          type="text" placeholder="Roll No" 
          className="border p-4 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-500"
          value={student.rollNo} 
          onChange={(e) => setStudent({ ...student, rollNo: e.target.value })} 
          required 
        />
        <motion.input 
          whileFocus={{ scale: 1.05 }} 
          whileHover={{ scale: 1.02 }} 
          type="text" placeholder="Enrollment No" 
          className="border p-4 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-500"
          value={student.enrollmentNo} 
          onChange={(e) => setStudent({ ...student, enrollmentNo: e.target.value })} 
          required 
        />
        <motion.input 
          whileFocus={{ scale: 1.05 }} 
          whileHover={{ scale: 1.02 }} 
          type="number" placeholder="Semester" 
          className="border p-4 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-500"
          value={student.semester} 
          onChange={(e) => setStudent({ ...student, semester: e.target.value })} 
          required 
        />
        <motion.input 
          whileFocus={{ scale: 1.05 }} 
          whileHover={{ scale: 1.02 }} 
          type="text" placeholder="Branch" 
          className="border p-4 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-500"
          value={student.branch} 
          onChange={(e) => setStudent({ ...student, branch: e.target.value })} 
          required 
        />
        
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }} 
          whileTap={{ scale: 0.95 }} 
          className="bg-blue-600 text-white p-4 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
        >
          Add Student
        </motion.button>
      </form>

      <div className="mt-6 flex flex-col items-center">
        <input type="file" onChange={handleFileUpload} accept=".csv, .xlsx" className="p-2 border rounded-lg"/>
        {file && <p className="text-sm text-gray-500 mt-2">File: {file.name}</p>}
      </div>
    </motion.div>
  );
}

export default AddStudent;
