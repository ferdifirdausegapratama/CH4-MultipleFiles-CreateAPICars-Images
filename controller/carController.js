const { Car } = require("../models");
const imagekit = require("../lib/imagekit");

async function getAllCars(req, res) {
  try {
    /* console.log("proses saat ada yang request");
    console.log(req.requestTime);
    console.log("proses siapa yang request");
    console.log(req.username);
    console.log("proses yang apa diminta");
    console.log(req.originalURL); */

    const cars = await Car.findAll();

    res.status(200).json({
      status: "200",
      message: "Success get cars data",
      isSuccess: true,
      data: { cars },
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function getCarById(req, res) {
  const id = req.params.id;
  try {
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        status: "404",
        message: "Car Not Found!",
      });
    }

    res.status(200).json({
      status: "200",
      message: "Success get cars data",
      isSuccess: true,
      data: { car },
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function deleteCarById(req, res) {
  const id = req.params.id;
  try {
    const car = await Car.findByPk(id);

    if (car) {
      await car.destroy();

      res.status(200).json({
        status: "200",
        message: "Success get cars data",
        isSuccess: true,
        data: { car },
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Car Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function updateCar(req, res) {
  const id = req.params.id;
  const { plate, model, type, year } = req.body;

  try {
    const car = await Car.findByPk(id);

    if (car) {
      car.plate = plate;
      car.model = model;
      car.type = type;
      car.year = year;

      await car.save();

      res.status(200).json({
        status: "200",
        message: "Success get cars data",
        isSuccess: true,
        data: { car },
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Car Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function createCar(req, res) {
  const files = req.files;
  const uploadedImages = [];

  for (i = 0; i < files.length; i++) {
    // 1. processing file nya
    let split = files[i].originalname.split(".");
    let ext = split[split.length - 1];
    let filename = split[0];

    //2. upload images ke server
    const uploadedImage = await imagekit.upload({
      file: files[i].buffer,
      fileName: `Car image-${filename}-${Date.now()}.${ext}`,
    });

    uploadedImages.push(uploadedImage.url);
  }

  const newCar = req.body;

  try {
    await Car.create({ ...newCar, images: uploadedImages });
    res.status(200).json({
      status: "Success",
      message: "Ping successfully",
      isSuccess: true,
      data: { ...newCar, images: uploadedImages },
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  deleteCarById,
  updateCar,
};
