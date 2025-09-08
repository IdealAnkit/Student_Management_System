import React, { useState, useEffect } from "react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getMarks,
  addMarks,
  logout,
} from "../api";
import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";
import ReportCard from "../components/ReportCard";
import MarksEntry from "../components/MarksEntry";
import "./Dashboard.css";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportCardStudent, setReportCardStudent] = useState(null);
  const [marksStudent, setMarksStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchFields, setSearchFields] = useState({
    roll_no: "",
    name: "",
    email: "",
    course: "",
    class: "",
  });

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  async function handleAddOrEdit(student) {
    setLoading(true);
    if (editing) {
      await updateStudent({ ...student, id: editing.id });
    } else {
      await addStudent(student);
    }
    setStudents(await getStudents());
    setEditing(null);
    setShowEditModal(false);
    setLoading(false);
  }

  async function handleDelete(id) {
    setLoading(true);
    await deleteStudent(id);
    setStudents(await getStudents());
    setLoading(false);
  }

  async function handleViewReportCard(student) {
    setReportCardStudent(student);
    setMarks(await getMarks(student.id));
    setMarksStudent(null);
    setShowEditModal(false);
  }

  function handleEnterMarks(student) {
    setMarksStudent(student);
    setReportCardStudent(null);
    setShowEditModal(false);
    setMarks([]);
  }

  function handleEdit(student) {
    setEditing(student);
    setShowEditModal(true);
    setReportCardStudent(null);
    setMarksStudent(null);
  }

  async function handleAddMarks(data) {
    await addMarks(data);
    if (marksStudent) {
      setMarks(await getMarks(marksStudent.id));
    }
  }

  async function handleLogout() {
    await logout();
    window.location.reload();
  }

  function handleCloseAllModals() {
    setReportCardStudent(null);
    setMarksStudent(null);
    setEditing(null);
    setShowEditModal(false);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "neon" ? "light" : "neon"));
  }

  // Filter students by individual search fields
  const filteredStudents = students.filter((s) => {
    const roll_no = searchFields.roll_no.toLowerCase();
    const name = searchFields.name.toLowerCase();
    const email = searchFields.email.toLowerCase();
    const course = searchFields.course.toLowerCase();
    const classVal = searchFields.class.toLowerCase();
    return (
      (!roll_no || s.roll_no?.toLowerCase().includes(roll_no)) &&
      (!name || s.name?.toLowerCase().includes(name)) &&
      (!email || s.email?.toLowerCase().includes(email)) &&
      (!course || s.course?.toLowerCase().includes(course)) &&
      (!classVal || s.class?.toLowerCase().includes(classVal))
    );
  });

  return (
    <div className={`dashboard-root ${theme}`}>
      <div className="dashboard-main">
        {/* Left column: main content */}
        <div className="dashboard-left">
          <div className="dashboard-header dashboard-card">
            <h1>Student Database</h1>
            <div className="dashboard-header-actions">
              <button onClick={toggleTheme} className="theme-switcher">
                Switch to {theme === "neon" ? "Light" : "Neon"} Theme
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
          <div className="dashboard-card">
            <h2 className="section-title">Add Student</h2>
            <StudentForm
              onSubmit={handleAddOrEdit}
              initialData={null}
              loading={loading}
            />
          </div>
          {/* Multi-field search */}
          <div
            className="dashboard-card student-search-row"
            style={{ marginBottom: 0, marginTop: 0, padding: "12px 12px" }}
          >
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              Search Students
            </h2>
            <div className="student-search-fields">
              <input
                type="text"
                className="student-search-input"
                placeholder="Roll No"
                value={searchFields.roll_no}
                onChange={(e) =>
                  setSearchFields((f) => ({ ...f, roll_no: e.target.value }))
                }
              />
              <input
                type="text"
                className="student-search-input"
                placeholder="Name"
                value={searchFields.name}
                onChange={(e) =>
                  setSearchFields((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                type="text"
                className="student-search-input"
                placeholder="Email"
                value={searchFields.email}
                onChange={(e) =>
                  setSearchFields((f) => ({ ...f, email: e.target.value }))
                }
              />
              <input
                type="text"
                className="student-search-input"
                placeholder="Course"
                value={searchFields.course}
                onChange={(e) =>
                  setSearchFields((f) => ({ ...f, course: e.target.value }))
                }
              />
              <input
                type="text"
                className="student-search-input"
                placeholder="Class"
                value={searchFields.class}
                onChange={(e) =>
                  setSearchFields((f) => ({ ...f, class: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="dashboard-card dashboard-list-toggle">
            <button
              onClick={() => setShowStudentList((prev) => !prev)}
              className="toggle-list-btn"
            >
              {showStudentList ? "Hide Student List" : "Show Student List"}
            </button>
            {showStudentList && (
              <>
                <h2 className="section-title" style={{ marginBottom: 12 }}>
                  Student List
                </h2>
                <StudentList
                  students={filteredStudents}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewReportCard={handleViewReportCard}
                  onEnterMarks={handleEnterMarks}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {/* Modal for Edit, Report Card, and Enter Marks */}
      {(showEditModal || marksStudent || reportCardStudent) && (
        <div className="dashboard-modal-overlay" onClick={handleCloseAllModals}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            {showEditModal && (
              <div>
                <h3>Edit Student</h3>
                <StudentForm
                  onSubmit={handleAddOrEdit}
                  initialData={editing}
                  loading={loading}
                />
              </div>
            )}
            {marksStudent && (
              <div>
                <h3>
                  Enter Marks for {marksStudent.name} (Roll No:{" "}
                  {marksStudent.roll_no})
                </h3>
                <MarksEntry
                  studentId={marksStudent.id}
                  onSubmit={handleAddMarks}
                />
              </div>
            )}
            {reportCardStudent && (
              <div>
                <ReportCard student={reportCardStudent} marks={marks} />
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <button
                className="dashboard-modal-close-bottom"
                onClick={handleCloseAllModals}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
