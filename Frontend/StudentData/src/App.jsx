import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    course: "",
    gender: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update student
        await axios.put(`http://localhost:5000/api/students/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Add new student
        await axios.post("http://localhost:5000/api/students", formData);
      }
      setFormData({ name: "", email: "", age: "", course: "", gender: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData(student);
    setEditingId(student._id);
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6">
        🎓 Student Details Form
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          type="number"
          name="age"
          value={formData.age}
          placeholder="Age"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          type="text"
          name="course"
          value={formData.course}
          placeholder="Course"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">👦 Male</option>
          <option value="Female">👩 Female</option>
          <option value="Other">⚧ Other</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </form>

      {/* Student List */}
      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
          📋 Submitted Students
        </h2>
        {students.length === 0 ? (
          <p className="text-gray-600">No students submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white p-4 rounded-xl shadow-md border hover:shadow-xl transition"
              >
                <h3 className="font-bold text-lg text-indigo-600">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-600">📧 {student.email}</p>
                <p className="text-sm text-gray-600">🎂 Age: {student.age}</p>
                <p className="text-sm text-gray-600">📘 Course: {student.course}</p>
                <p className="text-sm text-gray-600">⚧ Gender: {student.gender}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(student)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
