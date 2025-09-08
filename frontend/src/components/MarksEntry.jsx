import React, { useState } from 'react';
export default function MarksEntry({ studentId, onSubmit }) {
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ student_id: studentId, subject, marks: parseInt(marks, 10) });
    setSubject('');
    setMarks('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required />
      <input type="number" value={marks} onChange={e => setMarks(e.target.value)} placeholder="Marks" required />
      <button type="submit">Add Marks</button>
    </form>
  );
} 