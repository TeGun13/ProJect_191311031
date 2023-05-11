const Monitor = require('../models/monitor')
const Detail = require('../models/productDetails')

const fs = require('fs')
const path = require('path')
const uuidv4 = require('uuid')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const { validationResult } = require('express-validator')
const jwt = require("jsonwebtoken");
const config = require("../config/index");

//all brand  for user
exports.get = async (req, res, next) => {
  // const monitors = await Monitor.find().populate("productDetail", ['model', 'price', 'quantity','photo', 'detail']);
  // res.status(200).json({
  //   deta: monitors
  // });
  const monitors = await Monitor.find().sort({ _id: -1 });
  const monitor = monitors.map((monitors, index) => {
    return {
      title: monitors.title,
      brandid:monitors.brandid,
      id:monitors._id,
      // title: monitors.title,
      picture: config.Domain + ".cyclic.app/images/" + monitors.picture,

    }
  })
  res.send({ data: monitor })
}


exports.getdetailproduct = async (req, res, next) => {
  const { id } = req.params
  const monitorB = await Detail.find({_id:id})
 const monitors = await monitorB.map((monitors, index) => {
  return {
    title: monitors.title,
    model: monitors.model,
    brandid:monitors.brandid,
    id:monitors._id,
    quantity:monitors.quantity,
    price: monitors.price,
    picture: config.Domain + ".cyclic.app/images/" + monitors.picture,
    detail:monitors.detail

  }
})
res.send({ data: monitors })
}



exports.product = async (req, res, next) => {
  const { id } = req.params
  const monitorB = await Detail.find({brandid:id})
 const monitors = await monitorB.map((monitors, index) => {
  return {
    title: monitors.title,
    model: monitors.model,
    brandid:monitors.brandid,
    id:monitors._id,
    price: monitors.price,
    picture: config.Domain + ".cyclic.app/images/" + monitors.picture,
    detail:monitors.detail

  }
})
res.send({ data: monitors })
}

//all product detail for user
exports.getproduct = async (req, res, next) => {
  const monitorB = await Detail.find({comment:'1'})
  const details = monitorB.map((monitors, index) => {
    return {
      title: monitors.title,
      comment:monitors.comment,
      model: monitors.model,
      brandid:monitors.brandid,
      id:monitors._id,
      price: monitors.price,
      picture: config.Domain + ".cyclic.app/images/" + monitors.picture,
      detail:monitors.detail,
   
    }
  })
  res.send({ data: details })


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
    const { title,detail,picture,brandid } = req.body;

    //validation  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422
      error.validationResult = errors.array()
      throw error;
    }

    const exitBrand = await Monitor.findOne({ title: title })
    if (exitBrand) {
      const error = new Error("Already have this brand in system");
      error.statusCode = 400
      throw error;
    }

    const exitbrandid = await Monitor.findOne({ brandid: brandid })
    if (exitbrandid) {
      const error = new Error("Already have this brandid in system");
      error.statusCode = 400
      throw error;
    }

    let monitor = new Monitor({
      title: title,
      brandid:brandid,
      detail: detail,
      picture: picture ? await saveImageToDisk(picture) : undefined
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
      const {title, model, price, quantity, detail, picture,brandid } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("ข้อมูลไม่ครบถ้วน");
        error.statusCode = 422;
        error.validation = errors.array();
        throw error;
      }
      const details = new Detail({
        title: title,
        product: id,
        model: model,
        price: price,
        quantity: quantity,
        detail: detail,
        brandid: brandid,
        // photo :config.Domain + "/images/" + photo

        picture: picture ? await saveImageToDisk(picture) : undefined
      });

      // const detail = new Detail();
      // detail.id = id
      // detail.model = model
      // detail.price = price,
      // detail.quantity = quantity,
      // detail.photo = photo ? await saveImageToDisk(photo) : undefined

      // const result = await staffinsert.save()

      const exit = await Detail.findOne({ model: model })
      if (exit) {
        const error = new Error("Already have this model in system ");
        error.statusCode = 400
        throw error;
      }


      const result = await details.save()
      return res.status(200).json({ message: `เพิ่มสินค้าเรียบร้อยแล้ว: ${result != null}` })
  

    }
  } catch (error) {
    next(error);
  }
};


exports.update = async (req, res, next) => {

  try {
    const { id } = req.params
    const { title, detail,brandid,picture} = req.body

    const monitor = await Monitor.updateOne({ _id: id }, {
      title: title,
      detail: detail,
      brandid:brandid,
       picture: picture ? await saveImageToDisk(picture) : undefined
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
    const { comment,model, price, quantity, detail,brandid} = req.body

    const details = await Detail.updateOne({ _id: id }, {
      comment:comment, model: model, price: price, quantity: quantity, detail: detail,brandid:brandid
    });

    if (details.matchedCount === 0) {
      const error = new Error('Data not found')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ message: 'updated successfully' })
  } catch (err) {
    next(err)
  }
}

const saveImageToDisk = async (baseImage) => {
  //find project path
  const projectPath = path.resolve('./')
  //create path to save image
  const uploadPath = `${projectPath}/public/images/`
  //find file extension
  const ext = baseImage.substring(baseImage.indexOf('/') + 1, baseImage.indexOf(';base64'))
  //create file name w/ file extension by generate uuid
  let filename = ''
  if (ext === 'svg+xml') {
    filename = `${uuidv4.v4()}.svg`
  } else {
    filename = `${uuidv4.v4()}.${ext}`
  }
  //extract base64 data
  let image = decodeBase64Image(baseImage)
  //write new file with new filename at path
  await writeFileAsync(uploadPath + filename, image.data, 'base64')
  //return new filename
  return filename
}

const decodeBase64Image = (base64Str) => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  let image = {}
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string')
  }
  image.type = matches[1]
  image.data = matches[2]
  return image
}
