// Base API endpoint
const API = "http://localhost:3000/attendance";

// selecting requiered DOM elements
const dateInput = document.getElementById("attendanceDate");
const message = document.getElementById("message");
const attendanceSection = document.getElementById("attendanceSection");
const attendanceBody = document.getElementById("attendanceBody");
const attendanceHead = document.getElementById("attendanceHead");
const attendanceTitle = document.getElementById("attendanceTitle");
const attendanceDateLabel = document.getElementById("attendanceDateLabel");
const reportSection = document.getElementById("reportSection");
const reportBody = document.getElementById("reportBody");
const markBtn = document.getElementById("markBtn");
const searchBtn = document.getElementById("searchBtn");
const reportBtn = document.getElementById("reportBtn");

// ---- Application state ----
let date = ""; // selected date, format YYYY-MM-DD
let students = []; // students displayed in the attendance table
let marked = false; // whether attendance for `date` is already saved

//helper functions

// Display a status message to the user
function showMessage(text, type = "info") {
  message.textContent = text;
  message.dataset.type = type;
}

// Centralized error display (used by every API call)

function showError(error) {
  showMessage(error.response?.data?.message || error.message, "error");
  console.error(error);
}

// Get today's date as a YYYY-MM-DD string for the date input
function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Pre-fill the date input with today's date
dateInput.value = getTodayString();

// search attendance for the selected date
searchBtn.addEventListener("click", async () => {
  date = dateInput.value;

  if (!date) {
    return showMessage("Please select a date.", "info");
  }

  try {
    const { data } = await axios.get(`${API}/${date}`);
    marked = data.marked;

    // Already marked → use saved records.
    // Not marked     → use the full student list.
    students = marked
      ? data.attendance.map((record) => {
          const student = record.studentModel || record.student || {};
          return {
            id: student.id,
            name: student.name,
            status: record.status,
          };
        })
      : data.students.map((student) => ({
          id: student.id,
          name: student.name,
        }));

    // Guard against duplicate ids (they would collapse radio groups).
    const seen = new Set();
    for (const s of students) {
      if (seen.has(s.id)) console.warn("Duplicate student id:", s.id, s.name);
      seen.add(s.id);
    }

    renderAttendance();

    attendanceSection.hidden = false;
    reportSection.hidden = true;

    if (marked) {
      showMessage(`Attendance for ${date} is already marked.`, "info");
    } else {
      showMessage(
        `Attendance for ${date} is not marked yet. You can mark it now.`,
        "info",
      );
    }
  } catch (error) {
    showError(error);
  }
});

// render the attendance table based on the current state (date, students, marked)
function renderAttendance() {
  attendanceTitle.textContent = marked
    ? "Attendance Summary"
    : "Mark Attendance";
  attendanceDateLabel.textContent = `Date: ${date}`;

  attendanceHead.innerHTML = `
    <tr>
      <th>Student</th>
      <th>Attendance</th>
    </tr>
  `;

  attendanceBody.innerHTML = "";

  students.forEach((student) =>
    attendanceBody.appendChild(buildAttendanceRow(student)),
  );

  // Save button is only relevant when marking is possible
  markBtn.hidden = marked || students.length === 0;
}

// Build a single row of the attendance table
function buildAttendanceRow(student) {
  const row = document.createElement("tr");
  row.dataset.studentId = String(student.id); // used when saving

  // Name cell
  const nameCell = document.createElement("td");
  nameCell.textContent = student.name;

  // Status cell — saved text or radio buttons
  const statusCell = document.createElement("td");
  if (marked) {
    statusCell.textContent =
      student.status === "present" ? "Present" : "Absent";
  } else {
    statusCell.append(
      buildRadio("present", student.id),
      buildRadio("absent", student.id),
    );
  }

  row.append(nameCell, statusCell);
  return row;
}

// Build a labelled radio button (Present / Absent)
function buildRadio(value, studentId) {
  const label = document.createElement("label");
  const radio = document.createElement("input");

  radio.type = "radio";
  radio.name = `student-${studentId}`;
  radio.value = value;

  label.append(radio, value === "present" ? " Present " : " Absent ");
  return label;
}

// mark attendance for the selected date
markBtn.addEventListener("click", async () => {
  const attendance = [];
  const rows = attendanceBody.querySelectorAll("tr");

  // Read each row directly — no dependency on the `name` attribute.
  for (const row of rows) {
    const studentId = row.dataset.studentId;
    const name = row.firstElementChild.textContent;
    const selected = row.querySelector('input[type="radio"]:checked');

    if (!selected) {
      return showMessage(`Please select attendance for ${name}.`, "error");
    }

    attendance.push({ studentId, status: selected.value });
  }

  try {
    await axios.post(`${API}/mark`, { date, attendance });

    marked = true;
    showMessage("Attendance marked successfully.", "success");

    // Reload saved attendance from the server.
    searchBtn.click();
  } catch (error) {
    showError(error);
  }
});

// getting the attendance report
reportBtn.addEventListener("click", async () => {
  try {
    const { data } = await axios.get(`${API}/report`);

    reportBody.innerHTML = "";
    data.report.forEach((student) =>
      reportBody.appendChild(buildReportRow(student)),
    );

    reportSection.hidden = false;
    attendanceSection.hidden = true;

    showMessage("Report loaded.", "success");
  } catch (error) {
    showError(error);
  }
});

// Build a single row of the report table
function buildReportRow(student) {
  const row = document.createElement("tr");

  const values = [
    student.name,
    student.presentDays,
    student.absentDays,
    student.totalDays,
    `${Number(student.attendancePercentage).toFixed(2)}%`,
  ];

  values.forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  return row;
}
