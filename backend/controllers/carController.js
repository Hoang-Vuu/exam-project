const mongoose = require('mongoose');
const Car = require('../models/carModel');

// get all Cars
const getAllCars = async (req, res) => {

  try {
    const cars = await Car.find({}).sort({createdAt: -1})
    res.status(200).json(cars)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Add one Car
const createCar = async (req, res) => {
  try {
    const user_id = req.user._id;
    const newCar = new Car({
      ...req.body,
      user_id,
    });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Get Car by ID
const getCarById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such car'});
  }

  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Delete Car by ID
const deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
     // Get the ID of the currently authenticated user from the request object
    const user_id = req.user._id;
    const car = await Car.findByIdAndDelete({ _id: id, user_id: user_id });
    // Delete the car only if it matches both the car ID and the authenticated user's ID
    // This ensures that a user can only delete their own car
    // Previously, using Car.findByIdAndDelete({ _id: id }) would delete any car by ID,
    // regardless of ownership, which is a security issue.

    //const car = await Car.findByIdAndDelete({ _id: id,});

    // If no car is found, either the car does not exist or the authenticated user
    // does not own it. Returning a 404 prevents unauthorized deletion.
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(204).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Update Car by ID
const updateCar = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    // Update the car only if it belongs to the authenticated user
    // This adds an authorization check to ensure users can only update their own cars
    // Previously, using { _id: id } would allow any user to update any car
    // as long as they knew the car's ID, which is a security vulnerability.
    const car = await Car.findOneAndUpdate(
      { _id: id, user_id: user_id }, // // Authorization enforced here
      // { _id: id,  },
      { ...req.body },
      { new: true }
    );
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = {
  getAllCars,
  createCar,
  getCarById,
  deleteCar,
  updateCar,
};
