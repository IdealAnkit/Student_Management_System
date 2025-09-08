const { protocol, hostname } = window.location;
const BASE_URL =
  hostname === "localhost" ||
  hostname.startsWith("192.168.") ||
  hostname.startsWith("10.")
    ? `${protocol}//${hostname}/StudentManagementSystem/backend`
    : "http://localhost/StudentManagementSystem/backend";
export async function getStudents() {
  const res = await fetch(`${BASE_URL}/api/students/getAll.php`);
  return await res.json();
}
export async function getStudent(id) {
  const res = await fetch(`${BASE_URL}/api/students/getOne.php?id=${id}`);
  return await res.json();
}
export async function addStudent(student) {
  const res = await fetch(`${BASE_URL}/api/students/add.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  return await res.json();
}
export async function updateStudent(student) {
  const res = await fetch(`${BASE_URL}/api/students/update.php`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  return await res.json();
}
export async function deleteStudent(id) {
  const res = await fetch(`${BASE_URL}/api/students/delete.php?id=${id}`, {
    method: "DELETE",
  });
  return await res.json();
}
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  return await res.json();
}
export async function logout() {
  const res = await fetch(`${BASE_URL}/auth/logout.php`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
}
export async function checkSession() {
  const res = await fetch(`${BASE_URL}/auth/check-session.php`, {
    credentials: "include",
  });
  return await res.json();
}
export async function getMarks(student_id) {
  const res = await fetch(
    `${BASE_URL}/api/students/marks.php?student_id=${student_id}`
  );
  return await res.json();
}
export async function addMarks(data) {
  const res = await fetch(`${BASE_URL}/api/students/marks.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
