const { attendanceModel, studentModel } = require("../models/index");
const sequelize = require("../utils/database");

// GET /attendance/:date
const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const records = await attendanceModel.findAll({
      where: { date },
      include: [
        {
          model: studentModel,
          as: "studentModel",
          attributes: ["id", "name"],
        },
      ],
      order: [[{ model: studentModel, as: "studentModel" }, "name", "ASC"]],
    });

    if (records.length > 0) {
      return res.status(200).json({
        success: true,
        marked: true,
        date,
        count: records.length,
        attendance: records,
      });
    }

    const students = await studentModel.findAll({
      attributes: ["id", "name"],
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

// POST /attendance
const markAttendance = async (req, res) => {
  const { date, attendance } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const existingRecord = await attendanceModel.findOne({
      where: { date },
      transaction,
    });

    if (existingRecord) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    const records = attendance.map(({ studentId, status }) => ({
      studentId,
      date,
      status,
    }));

    await attendanceModel.bulkCreate(records, { transaction });

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

    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
    });
  }
};

// GET /attendance/report
const getAttendanceReport = async (req, res) => {
  try {
    const students = await studentModel.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: attendanceModel,
          as: "attendances",
          attributes: ["status", "date"],
          required: false,
        },
      ],
      order: [["name", "ASC"]],
    });

    const report = students.map((student) => {
      const records = student.attendances || [];

      const presentDays = records.filter(
        (record) => record.status === "present",
      ).length;

      const totalDays = records.length;
      const absentDays = totalDays - presentDays;

      return {
        id: student.id,
        name: student.name,
        presentDays,
        absentDays,
        totalDays,
        attendancePercentage:
          totalDays === 0
            ? 0
            : Number(((presentDays / totalDays) * 100).toFixed(2)),
      };
    });

    return res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate attendance report",
    });
  }
};

module.exports = {
  getAttendanceByDate,
  markAttendance,
  getAttendanceReport,
};
