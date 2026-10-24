const { studentModel } = require("../models/index");

const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.findAll({
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

const addStudent = async (req, res) => {
  try {
    const { name } = req.body;
    const student = studentModel.create({ name: name });

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      err: err.message,
    });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
};
