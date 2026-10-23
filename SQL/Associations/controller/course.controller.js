const { studentModel, courseModel } = require("../models/association");

const addCourse = async (req, res) => {
  try {
    const { name } = req.body;

    const course = await courseModel.create({ name });
    res.status(201).json({ course: course });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const addStudentsToCourses = async (req, res) => {
  try {
    const { studentId, courseIds } = req.body;

    const student = await studentModel.findByPk(studentId);

    const courses = await courseModel.findAll({
      where: {
        id: courseIds,
      },
    });

    await student.addCourses(courses);

    const updatedStudent = await studentModel.findByPk(studentId, {
      include: courseModel,
    });

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

module.exports = {
  addCourse,
  addStudentsToCourses,
};
