const createBooking = async (req, res) => {
  try {
    const { userId, busId, seatNumber } = req.body;

    const booking = await bookingsModel.create({
      UserId: userId,
      BusId: busId,
      seatNumber,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingsModel.findAll({
      where: { UserId: req.params.id },
      include: [
        {
          model: busModel,
          attributes: ["busNumber"],
        },
      ],
    });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getBusBookings = async (req, res) => {
  try {
    const bookings = await bookingsModel.findAll({
      where: { BusId: req.params.id },
      include: [
        {
          model: userModel,
          attributes: ["name", "email"],
        },
      ],
    });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBusBookings,
};
