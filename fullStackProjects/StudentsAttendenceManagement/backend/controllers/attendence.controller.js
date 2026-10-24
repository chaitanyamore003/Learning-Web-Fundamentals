const { attendanceModel, studentModel } = require("../models/index");

const isValidDate = (date) => {
  if (typeof date !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
};

// GET /attendance/:date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date in YYYY-MM-DD format",
      });
    }

    const records = await Attendance.findAll({
      where: { date },
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [[{ model: Student, as: "student" }, "name", "ASC"]],
    });

    // At least one record means attendance has been marked.
    if (records.length > 0) {
      return res.status(200).json({
        success: true,
        marked: true,
        date,
        count: records.length,
        attendance: records,
      });
    }

    // No attendance exists: return the full student list.
    const students = await Student.findAll({
      attributes: ["id", "name", "email"],
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      marked: false,
      date,
      count: students.length,
      students: students.map((student) => ({
        ...student.toJSON(),
        status: null,
      })),
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

// POST /attendance
exports.markAttendance = async (req, res) => {
  const { date, attendance } = req.body;

  if (!isValidDate(date)) {
    return res.status(400).json({
      success: false,
      message: "A valid date in YYYY-MM-DD format is required",
    });
  }

  if (!Array.isArray(attendance) || attendance.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Attendance must contain at least one student",
    });
  }

  const studentIds = attendance.map((record) => record.studentId);

  if (
    studentIds.some((id) => !Number.isInteger(id) || id <= 0) ||
    new Set(studentIds).size !== studentIds.length
  ) {
    return res.status(400).json({
      success: false,
      message: "Student IDs must be valid and unique",
    });
  }

  const invalidStatus = attendance.some(
    (record) => !["present", "absent"].includes(record.status),
  );

  if (invalidStatus) {
    return res.status(400).json({
      success: false,
      message: "Each student must be marked present or absent",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Check whether this date has already been marked.
    const existingRecord = await Attendance.findOne({
      where: { date },
      transaction,
    });

    if (existingRecord) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: "Attendance has already been marked for this date",
      });
    }

    // Ensure every current student is included.
    const students = await Student.findAll({
      attributes: ["id"],
      transaction,
    });

    const actualIds = students.map((student) => student.id);

    const submittedIds = [...studentIds].sort((a, b) => a - b);
    const expectedIds = [...actualIds].sort((a, b) => a - b);

    if (
      submittedIds.length !== expectedIds.length ||
      submittedIds.some((id, index) => id !== expectedIds[index])
    ) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Attendance must include every current student exactly once",
      });
    }

    const records = attendance.map(({ studentId, status }) => ({
      studentId,
      date,
      status,
    }));

    await Attendance.bulkCreate(records, { transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      date,
      count: records.length,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Error marking attendance:", error);

    // Covers concurrent submissions that violate the unique index.
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Attendance has already been recorded for this date",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
    });
  }
};

// GET /attendance/report
exports.getAttendanceReport = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Attendance,
          as: "attendances",
          attributes: ["status", "date"],
          required: false,
        },
      ],
      order: [["name", "ASC"]],
    });

    const report = students.map((student) => {
      const records = student.attendances || [];

      const totalDays = records.length;

      const presentDays = records.filter(
        (record) => record.status === "present",
      ).length;

      const absentDays = totalDays - presentDays;

      const percentage =
        totalDays === 0
          ? 0
          : Number(((presentDays / totalDays) * 100).toFixed(2));

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        presentDays,
        absentDays,
        totalDays,
        attendancePercentage: percentage,
      };
    });

    return res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    console.error("Error generating report:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate attendance report",
    });
  }
};
