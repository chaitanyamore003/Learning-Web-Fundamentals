const studentModel = require("./students");
const identityCardModel = require("./identityCard");

//one to one relationship

//student table has one relationship with identityCard table
studentModel.hasOne(identityCardModel);

//identity card belongs to only one student
identityCardModel.belongsTo(studentModel);

module.exports = {
  studentModel,
  identityCardModel,
};
