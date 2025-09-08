import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createPortal } from "react-dom";

export default function StudentList({
  students,
  onEdit,
  onDelete,
  onViewReportCard,
  onEnterMarks,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const dropdownBtnRefs = useRef({});
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 700);

  useEffect(() => {
    function handleScrollOrResize() {
      if (openDropdown && dropdownBtnRefs.current[openDropdown]) {
        const btn = dropdownBtnRefs.current[openDropdown];
        const rect = btn.getBoundingClientRect();
        setDropdownPos(getDropdownFixedPos(rect));
      }
    }
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [openDropdown]);

  useEffect(() => {
    function handleResize() {
      setIsMobileScreen(window.innerWidth < 700);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleAction(student, action) {
    setOpenDropdown(null);
    setDropdownPos(null);
    if (action === "edit") onEdit(student);
    else if (action === "delete") onDelete(student.id);
    else if (action === "view") onViewReportCard(student);
    else if (action === "marks") onEnterMarks(student);
  }

  function handleDropdownOpen(id) {
    setOpenDropdown(id);
    setTimeout(() => {
      const btn = dropdownBtnRefs.current[id];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setDropdownPos(getDropdownFixedPos(rect));
      }
    }, 0);
  }

  function getDropdownFixedPos(rect) {
    const menuWidth = 180;
    const menuHeight = 180;
    const margin = 6;
    let left = rect.left;
    let top = rect.bottom + margin;
    // If would overflow right, open to left
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    // If would overflow bottom, open upward
    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - margin;
    }
    if (top < 0) top = 8;
    if (left < 0) left = 8;
    return { left, top, width: menuWidth, zIndex: 4000 };
  }

  function renderDropdownMenu(s) {
    if (!dropdownPos || openDropdown !== s.id) return null;
    return createPortal(
      <div
        className="actions-dropdown-menu refined"
        style={{
          position: "fixed",
          left: dropdownPos.left,
          top: dropdownPos.top,
          width: dropdownPos.width,
          zIndex: dropdownPos.zIndex,
          maxHeight: 220,
          overflowY: "auto",
        }}
      >
        <button onClick={() => handleAction(s, "edit")}>Edit</button>
        <button onClick={() => handleAction(s, "delete")}>Delete</button>
        <button onClick={() => handleAction(s, "view")}>
          View Report Card
        </button>
        <button onClick={() => handleAction(s, "marks")}>Enter Marks</button>
      </div>,
      document.body
    );
  }

  function handlePrintStudentList() {
    // Mobile-friendly print approach using blob and iframe
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 10px; 
            font-size: 12px;
            line-height: 1.4;
          }
          h2 { 
            color: #000; 
            margin-bottom: 15px; 
            font-size: 16px;
            text-align: center;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            font-size: 11px;
          }
          th, td { 
            border: 1px solid #000; 
            padding: 4px 6px; 
            text-align: left; 
            word-wrap: break-word;
          }
          th { 
            background-color: #f0f0f0; 
            font-weight: bold; 
            font-size: 12px;
          }
          @media print {
            body { margin: 0; padding: 5px; }
            h2 { margin-bottom: 10px; }
            table { font-size: 10px; }
            th, td { padding: 3px 4px; }
          }
        </style>
      </head>
      <body>
        <h2>Student List</h2>
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            ${students
              .map(
                (s) => `
              <tr>
                <td>${s.roll_no || ""}</td>
                <td>${s.name || ""}</td>
                <td>${s.email || ""}</td>
                <td>${s.course || ""}</td>
                <td>${s.class || ""}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Check if it's a mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // For mobile: Create a temporary element and trigger print
      const blob = new Blob([printContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Create hidden iframe for printing
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top = "-1000px";
      iframe.style.left = "-1000px";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.opacity = "0";

      document.body.appendChild(iframe);

      iframe.onload = function () {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          // Fallback: show content in current window
          const newWindow = document.createElement("div");
          newWindow.innerHTML = printContent;
          newWindow.style.position = "fixed";
          newWindow.style.top = "0";
          newWindow.style.left = "0";
          newWindow.style.width = "100%";
          newWindow.style.height = "100%";
          newWindow.style.backgroundColor = "white";
          newWindow.style.zIndex = "9999";
          newWindow.style.overflow = "auto";
          newWindow.style.padding = "20px";

          const closeBtn = document.createElement("button");
          closeBtn.textContent = "Close";
          closeBtn.style.position = "fixed";
          closeBtn.style.top = "10px";
          closeBtn.style.right = "10px";
          closeBtn.style.zIndex = "10000";
          closeBtn.onclick = () => document.body.removeChild(newWindow);

          newWindow.appendChild(closeBtn);
          document.body.appendChild(newWindow);

          // Try to print after a delay
          setTimeout(() => window.print(), 500);
        }

        // Clean up
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          URL.revokeObjectURL(url);
        }, 1000);
      };

      iframe.src = url;
    } else {
      // For desktop: Use new window approach
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      } else {
        alert("Please allow pop-ups for this site to enable printing.");
      }
    }
  }

  return (
    <div className="student-list-table-container">
      <button
        className="student-list-print-btn"
        style={{ marginBottom: 12 }}
        onClick={handlePrintStudentList}
      >
        Print Student List
      </button>
      <div className="student-list-print-container">
        <div className="table-responsive">
          <table className="StudentListTable">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.roll_no}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>{s.class}</td>
                  <td style={{ position: "relative" }}>
                    <button
                      className="actions-dropdown-btn compact"
                      onClick={() =>
                        openDropdown === s.id
                          ? setOpenDropdown(null)
                          : handleDropdownOpen(s.id)
                      }
                      style={{ minWidth: 32, padding: "6px 12px" }}
                      ref={(el) => (dropdownBtnRefs.current[s.id] = el)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === s.id}
                    >
                      <span style={{ fontWeight: 600 }}>⋮</span>
                      <span className="actions-arrow" />
                    </button>
                    {renderDropdownMenu(s)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
