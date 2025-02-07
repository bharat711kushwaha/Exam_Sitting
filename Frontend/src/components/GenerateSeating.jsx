import { useState } from "react";
import axios from "axios";

function GenerateSeating() {
  const [desks, setDesks] = useState(10);
  const [semesters, setSemesters] = useState([5, 7]);
  const [branches, setBranches] = useState(["CSE", "IT"]); // 🆕 Default branches
  const [studentsPerDesk, setStudentsPerDesk] = useState(2);
  const [seating, setSeating] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/seating/generate", {
        desks,
        semesters,
        branches, 
        studentsPerDesk,
      });
      setSeating(res.data.seatingPlan);
    } catch (err) {
      setError("Error generating seating plan.");
      console.error("Error generating seating plan", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/seating/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "seating.xlsx");
      document.body.appendChild(a);
      a.click();
    } catch (err) {
      console.error("Error exporting seating plan", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Seating Plan Generator</h2>

      {/* Number of Desks */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Number of Desks</label>
        <input
          type="number"
          value={desks}
          onChange={(e) => setDesks(Number(e.target.value))}
          className="w-full mt-2 p-2 border rounded"
        />
      </div>

      {/* Semesters */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Semesters</label>
        <input
          type="text"
          value={semesters.join(",")}
          onChange={(e) => setSemesters(e.target.value.split(",").map(Number))}
          className="w-full mt-2 p-2 border rounded"
        />
        <small className="block text-xs mt-2 text-gray-500">
          Enter semesters as comma-separated values (e.g., 5,7).
        </small>
      </div>

      {/* Branches 🆕 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Branches</label>
        <input
          type="text"
          value={branches.join(",")}
          onChange={(e) => setBranches(e.target.value.split(","))}
          className="w-full mt-2 p-2 border rounded"
        />
        <small className="block text-xs mt-2 text-gray-500">
          Enter branches as comma-separated values (e.g., CSE,IT,ME).
        </small>
      </div>

      {/* Students Per Desk */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Students Per Desk</label>
        <input
          type="number"
          value={studentsPerDesk}
          onChange={(e) => setStudentsPerDesk(Number(e.target.value))}
          className="w-full mt-2 p-2 border rounded"
        />
      </div>

      {/* Generate Seating Button */}
      <button
        onClick={handleGenerate}
        className="bg-green-500 text-white p-2 rounded-lg w-full hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Seating"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Display seating plan */}
      {seating.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Seating Plan</h3>
          <ul className="mt-2">
            {seating.map((desk, index) => (
              <li key={index} className="seat bg-gray-200 p-2 rounded-lg my-2">
                {`Desk ${index + 1}: ${desk.students.join(", ")} (${desk.branch})`}
              </li>
            ))}
          </ul>
          <button
            onClick={handleExport}
            className="bg-blue-500 text-white p-2 rounded-lg w-full mt-4 hover:bg-blue-700"
          >
            Download Excel
          </button>
        </div>
      )}
    </div>
  );
}

export default GenerateSeating;
