const userModel = require("../models/users.model");
const busModel = require("../models/buses.model");
const bookingsModel = require("../models/bookings.model");

//one to many for linking users to bookings
userModel.hasMany(bookingsModel);
bookingsModel.belongsTo(userModel);

//one to many for linking buses to bookings
busModel.hasMany(bookingsModel);
bookingsModel.belongsTo(busModel);

module.exports = {
  userModel,
  busModel,
  bookingsModel,
};
