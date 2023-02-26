const mongoose = require('mongoose');
const Schema = mongoose.Schema


const monitorSchema = new Schema({
    // photo: { type: String, default: 'nopic.png' },
    title: {type: String, require: true, trim: true},
    detail:{ type: String, require: true},
    // modelName: { type: String, require: true, trim: true },
    // price: { type: Number, require: true, trim: true },
    // amount: { type: Number, require: true, trim: true },
    createdAt: { type: Date, default: Date.now }, //มองกูดสร้างให้เอง ต้องให้ ทามสแสม ทรู
    updatedAt: { type: Date, default: Date.now },
    photo: {
        type: String,
        default: 'nopic.png'
      }
 },{
// {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     collection: "monitors" ,
//     virtuals: {
//       productDetail: {
//         options: { ref: "productDetail", localField: "_id", foreignField: "product" },
//       },
//     },
//   }
// );

    toJSON: { virtuals: true }, collection: 'monitors', timestamps: true
},



);
monitorSchema.virtual('productDetail', {
    ref: 'productDetail',
    localField: '_id',
    foreignField: 'product'
})

const monitor = mongoose.model("Monitor", monitorSchema);

module.exports = monitor