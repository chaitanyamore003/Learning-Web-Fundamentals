const studentModel = require("./students");
const identityCardModel = require("./identityCard");
const courseModel = require("../models/courses");
const studentCourses = require("../models/studentCourses");
const department = require("../models/department");

//1 --> one to one relationship

//student table has one relationship with identityCard table
studentModel.hasOne(identityCardModel);
//identity card belongs to only one student
identityCardModel.belongsTo(studentModel);

//2 --> one to many relationship
department.hasMany(studentModel);
studentModel.belongsTo(department);

//3 --> many to many relationship
studentModel.belongsToMany(courseModel, { through: studentCourses });
courseModel.belongsToMany(studentModel, { through: studentCourses });

module.exports = {
  studentModel,
  identityCardModel,
  courseModel,
};
