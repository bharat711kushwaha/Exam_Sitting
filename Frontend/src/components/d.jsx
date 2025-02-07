import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const data = [
    // Semester 4 - CSE
    {
      "rollNo": "23027101",
      "enrollmentNo": "ggv/23/01101",
      "semester": 4,
      "branch": "CSE"
    },
    {
      "rollNo": "23027102",
      "enrollmentNo": "ggv/23/01102",
      "semester": 4,
      "branch": "CSE"
    },
    {
      "rollNo": "23027103",
      "enrollmentNo": "ggv/23/01103",
      "semester": 4,
      "branch": "CSE"
    },
  
    // Semester 4 - IT
    {
      "rollNo": "23026101",
      "enrollmentNo": "ggv/23/01201",
      "semester": 4,
      "branch": "IT"
    },
    {
      "rollNo": "23026102",
      "enrollmentNo": "ggv/23/01202",
      "semester": 4,
      "branch": "IT"
    },
  
    // Semester 6 - CSE
    {
      "rollNo": "22027101",
      "enrollmentNo": "ggv/23/02101",
      "semester": 6,
      "branch": "CSE"
    },
    {
      "rollNo": "22027102",
      "enrollmentNo": "ggv/23/02102",
      "semester": 6,
      "branch": "CSE"
    },
    {
      "rollNo": "22027103",
      "enrollmentNo": "ggv/23/02103",
      "semester": 6,
      "branch": "CSE"
    },
  
    // Semester 6 - IT
    {
      "rollNo": "22026101",
      "enrollmentNo": "ggv/23/02201",
      "semester": 6,
      "branch": "IT"
    },
    {
      "rollNo": "22026102",
      "enrollmentNo": "ggv/23/02202",
      "semester": 6,
      "branch": "IT"
    },
  
    // Semester 6 - ECE
    {
      "rollNo": "22025101",
      "enrollmentNo": "ggv/23/02301",
      "semester": 6,
      "branch": "ECE"
    },
    {
      "rollNo": "22025102",
      "enrollmentNo": "ggv/23/02302",
      "semester": 6,
      "branch": "ECE"
    },
  
    // Semester 8 - CSE
    {
      "rollNo": "21027101",
      "enrollmentNo": "ggv/23/03101",
      "semester": 8,
      "branch": "CSE"
    },
    {
      "rollNo": "21027102",
      "enrollmentNo": "ggv/23/03102",
      "semester": 8,
      "branch": "CSE"
    },
  
    // Semester 8 - IT
    {
      "rollNo": "21026101",
      "enrollmentNo": "ggv/23/03201",
      "semester": 8,
      "branch": "IT"
    },
    {
      "rollNo": "21026102",
      "enrollmentNo": "ggv/23/03202",
      "semester": 8,
      "branch": "IT"
    }
  ];
  
 
  
  
  
const getRandomData = (arr, count) => {
  let shuffled = [...arr].sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, count);
};

const ExportToExcel = () => {
  const handleExport = () => {
    let selectedData = getRandomData(data, Math.min(20, data.length)); // Get random 20 or less
    let formattedData = selectedData.map(({ rollNo, enrollmentNo, semester,branch }) => ({
      rollNo,
      enrollmentNo,
      semester,
      branch
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(file, "students.xlsx");
  };

  return (
    <button
      onClick={handleExport}
      className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all"
    >
      Download Excel
    </button>
  );
};

export default ExportToExcel;
