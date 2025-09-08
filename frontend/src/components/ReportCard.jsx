import React, { useState, useEffect } from "react";
export default function ReportCard({ student, marks }) {
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 700);
  useEffect(() => {
    function handleResize() {
      setIsMobileScreen(window.innerWidth < 700);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!student) return <div>Select a student to view report card.</div>;

  function handlePrintReportCard() {
    // Mobile-friendly print approach using blob and iframe
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Card - ${student.name}</title>
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
          .student-info { 
            margin-bottom: 15px; 
            line-height: 1.6; 
            font-size: 12px;
          }
          .student-info strong { font-weight: bold; }
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
            .student-info { margin-bottom: 10px; }
            table { font-size: 10px; }
            th, td { padding: 3px 4px; }
          }
        </style>
      </head>
      <body>
        <h2>Report Card</h2>
        <div class="student-info">
          <strong>Name:</strong> ${student.name}<br>
          <strong>Roll No:</strong> ${student.roll_no}<br>
          <strong>Class:</strong> ${student.class}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            ${marks
              .map(
                (m, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${m.subject || ""}</td>
                <td>${m.marks || ""}</td>
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
    <div className="report-card-print-container">
      <button
        className="report-card-print-btn"
        style={{ marginBottom: 12 }}
        onClick={handlePrintReportCard}
      >
        Print Report Card
      </button>
      <h2>Report Card</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Name:</strong> {student.name} <br />
        <strong>Roll No:</strong> {student.roll_no} <br />
        <strong>Class:</strong> {student.class}
      </div>
      <table className="ReportCardTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{m.subject}</td>
              <td>{m.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
