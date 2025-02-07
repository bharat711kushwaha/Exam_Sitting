import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FaPlus, FaTable } from "react-icons/fa";
import AddStudent from "./components/AddStudent";
import GenerateSeating from "./components/GenerateSeating.jsx";
import J from "./components/d.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Student Seating Arrangement</h1>
        <nav className="flex gap-4 mb-6">
          <Link className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2" to="/">
            <FaPlus /> Add Student
          </Link>
          <Link className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2" to="/seating">
            <FaTable /> Generate Seating
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<AddStudent />} />
          <Route path="/seating" element={<GenerateSeating />} />
          <Route path="/j" element={<J/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
