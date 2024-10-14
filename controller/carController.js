const { Car } = require("../models");
const imagekit = require("../lib/imagekit");

// Mendapatkan semua data mobil
async function getAllCars(req, res) {
  try {
    /* console.log("proses saat ada yang request");
    console.log(req.requestTime);
    console.log("proses siapa yang request");
    console.log(req.username);
    console.log("proses yang apa diminta");
    console.log(req.originalURL); */

    // Semua data mobil dari database
    const cars = await Car.findAll();

    // Respon sukses dengan data mobil
    res.status(200).json({
      status: "200",
      message: "Success get cars data",
      isSuccess: true,
      data: { cars },
    });
  } catch (error) {
    // Respon gagal jika terjadi kesalahan
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

// Mendapatkan data mobil berdasarkan ID
async function getCarById(req, res) {
  const id = req.params.id;
  try {
    // Mencari mobil berdasarkan ID
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

// Mnghapus data mobil berdasarkan ID
async function deleteCarById(req, res) {
  const id = req.params.id;
  try {
    // Mencari mobil berdasarkan ID
    const car = await Car.findByPk(id);

    if (car) {
      // Menghapus data mobil jika ditemukan
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

// Memperbarui data mobil
async function updateCar(req, res) {
  const id = req.params.id;
  const { plate, model, type, year } = req.body;

  try {
    // Mencari mobil berdasarkan ID
    const car = await Car.findByPk(id);

    if (car) {
      // Memperbarui data mobil
      car.plate = plate;
      car.model = model;
      car.type = type;
      car.year = year;

      // Menyimpan perubahan data mobil
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

// Membuat data mobil baru
async function createCar(req, res) {
  const files = req.files;
  const uploadedImages = [];

  if (!files || files.length === 0) {
    return res.status(400).json({
      status: "400",
      message: "No files were uploaded.",
      isSuccess: false,
    });
  }

  // Mengupload setiap file gambar menggunakan ImageKit
  for (let i = 0; i < files.length; i++) {
    let split = files[i].originalname.split(".");
    let ext = split[split.length - 1];
    let filename = split[0];

    try {
      const uploadedImage = await imagekit.upload({
        file: files[i].buffer,
        fileName: `Car image-${filename}-${Date.now()}.${ext}`,
      });

      uploadedImages.push(uploadedImage.url);
    } catch (uploadError) {
      console.error(
        `Error uploading file ${files[i].originalname}:`,
        uploadError.message
      );
      // Memutuskan untuk menghentikan eksekusi atau melanjutkan dengan file lainnya
      return res.status(500).json({
        status: "500",
        message: `Failed to upload file ${files[i].originalname}`,
        isSuccess: false,
        error: uploadError.message,
      });
    }
  }

  const newCar = req.body;

  try {
    // Data mobil baru dengan gambar yang telah diupload
    const createdCar = await Car.create({ ...newCar, images: uploadedImages });
    res.status(200).json({
      status: "Success",
      message: "Car created successfully",
      isSuccess: true,
      data: { ...createdCar.toJSON(), images: uploadedImages },
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to create car",
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
