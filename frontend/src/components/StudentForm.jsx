import React, { useState, useEffect } from 'react';
export default function StudentForm({ onSubmit, initialData, loading }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    roll_no: '',
    course: '',
    class: '',
  });
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="student-form-fields">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="roll_no" value={form.roll_no} onChange={handleChange} placeholder="Roll No" required />
        <input name="course" value={form.course} onChange={handleChange} placeholder="Course" required />
        <input name="class" value={form.class} onChange={handleChange} placeholder="Class" required />
      </div>
      <div className="student-form-submit-row">
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
} 