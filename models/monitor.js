const mongoose = require('mongoose');
const Schema = mongoose.Schema


const monitorSchema = new Schema({
    // photo: { type: String, default: 'nopic.png' },
    brand: {type: String, require: true, trim: true},
    // modelName: { type: String, require: true, trim: true },
    // price: { type: Number, require: true, trim: true },
    // amount: { type: Number, require: true, trim: true },
    createdAt: { type: Date, default: Date.now }, //มองกูดสร้างให้เอง ต้องให้ ทามสแสม ทรู
    updatedAt: { type: Date, default: Date.now },


}, {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
        productDetail: {
        options: { ref: "productDetails", localField: "_id", foreignField: "product" },
      },
    },
  }
);
//     toJSON: { virtuals: true }, collection: 'monitors', timestamps: true
// },



// );
// monitorSchema.virtual('productDetails', {
//     ref: 'productDetails',
//     localField: '_id',
//     foreignField: 'brand'
// })

const monitor = mongoose.model("Monitor", monitorSchema);

module.exports = monitor