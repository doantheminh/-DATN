import mongoose, { Mongoose } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String },
    email: { type: String },
    products: [
      {
        type: Object
      }
    ],

    userId: { type: String },
    isPaid: { type: Boolean, default: false },
    total: { type: Number, require: true },
    shipping: { type: String, require: true },
    phone: { type: Number },
    fullName: { type: String },
    payMethod: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    LydoHoandon: { type: String },
    Motahoandon: { type: String },
    Emaill: { type: String },
    discountCode: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Discount",
      },
    ],
    discountAmount: { type: Number, default: 0 },

    ordercomments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Ordercomments',
      },
    ],
  }, {
  timestamps: true
}
);
orderSchema.plugin(mongoosePaginate);
export default mongoose.model('Order', orderSchema);
