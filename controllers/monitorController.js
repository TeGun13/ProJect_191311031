const Monitor = require('../models/monitor')
const Detail = require('../models/productDetails')

const fs = require('fs');

const { promisify } = require('util')

const { validationResult } = require("express-validator");



//all brand  for user
exports.get = async (req, res, next) => {
  const monitors = await Monitor.find().populate("productDetail", ['model', 'price', 'quantity']);
  res.status(200).json({
   data:monitors
  });
}
//all product detail for user
exports.getproduct = async (req, res, next) => {
  const detail = await Detail.find().sort({ _id: -1 });
  const monitors = await Monitor.find().populate("productDetail", ['model', 'price', 'quantity']);
  const details = detail.map((detail, index) => {
    return {
      name:monitors,
      model: detail.model,
      price: detail.price,
      quantity: detail.quantity,
    }
  })
  res.status(200).json({
    data: details

  })
}

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params
    const monitor = await Monitor.find().populate("productDetail").deleteOne({ _id: id });
    // const monitor = await Monitor.deleteOne({ _id: id })
    if (monitor.deletedCount === 0) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'deleted successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

exports.detaildestroy = async (req, res) => {
  try {
    const { id } = req.params
    const detail = await Detail.deleteOne({ _id: id })
    if (detail.deletedCount === 0) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'deleted successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

//add brand
exports.insert = async (req, res, next) => {
  try {
    // res.render('index', { title: 'Express' });
    const { brand } = req.body;

    //validation  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422
      error.validationResult = errors.array()
      throw error;
    }

    const exitBrand = await Monitor.findOne({ brand: brand })
    if (exitBrand) {
      const error = new Error("Already have this brand in system");
      error.statusCode = 400
      throw error;
    }

    let monitor = new Monitor({
      brand: brand
    });
    await monitor.save()

    res.status(200).json({
      message: 'เพิ่มข้อมูลเรียบร้อยแล้ว',

    })
  } catch (error) {
    next(error)
  }
}
//add brand detail
exports.insertDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const monitor = await Monitor.findOne({ _id: id });
    if (!monitor) {
      const error = new Error("ไม่พบสินค้า");
      error.statusCode = 400;
      throw error;
    } else {
      const { model, price, quantity, } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("ข้อมูลไม่ครบถ้วน");
        error.statusCode = 422;
        error.validation = errors.array();
        throw error;
      }
      const detail = new Detail({
        product: id,
        model: model,
        price: price,
        quantity: quantity,

      });
      const exit = await Detail.findOne({ model: model })
      if (exit) {
        const error = new Error("Already have this model in system ");
        error.statusCode = 400
        throw error;
      }

      await detail.save();
      res.status(200).json({
        message: "เพิ่มสินค้าเรียบร้อยแล้ว",
      });

    }
  } catch (error) {
    next(error);
  }
};


exports.update = async (req, res, next) => {

  try {
    const { id } = req.params
    const { brand } = req.body

    const monitor = await Monitor.updateOne({ _id: id }, {
      brand: brand
    });

    if (monitor.matchedCount === 0) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ message: 'updated successfully' })
  } catch (err) {
    next(err)
  }
}
exports.updatedetail = async (req, res, next) => {

  try {
    const { id } = req.params
    const { model, price, quantity } = req.body

    const detail = await Detail.updateOne({ _id: id }, {
      model: model, price: price, quantity: quantity
    });

    if (detail.matchedCount === 0) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ message: 'updated successfully' })
  } catch (err) {
    next(err)
  }
}