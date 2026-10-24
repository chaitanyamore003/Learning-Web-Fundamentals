const userModel = require("./user.model");
const expenseModel = require("./expense.model");

//one to many relationship
userModel.hasMany(expenseModel);
expenseModel.belongsTo(userModel);

module.exports = {
  userModel,
  expenseModel,
};
