const studentModel = require("./student.model");
const attendanceModel = require("./attendence.model");

// One studentModel can have many attendanceModel records.
studentModel.hasMany(attendanceModel, {
  foreignKey: "studentId",
  as: "attendances",
  onDelete: "CASCADE",
});

// Each attendanceModel record belongs to one studentModel.
attendanceModel.belongsTo(studentModel, {
  foreignKey: "studentId",
  as: "studentModel",
});

module.exports = {
  studentModel,
  attendanceModel,
};
