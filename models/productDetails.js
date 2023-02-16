const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDetailSchema = new Schema(
  {
    model: { type: String, require: true, trim: true },
    price: { type: Number },
    quantity: { type: Number }, 
    createdAt: { type: Date, default: Date.now }, //มองกูดสร้างให้เอง ต้องให้ ทามสแสม ทรู
    updatedAt: { type: Date, default: Date.now },
    product: { type: Schema.Types.ObjectId,ref:'Monitor' },
  },
  { collection: "productDetails" }
);

const productDetail = mongoose.model("productDetail", productDetailSchema);

module.exports = productDetail;