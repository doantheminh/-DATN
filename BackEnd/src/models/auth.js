import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const authSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    favourite: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Favourite",
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      default: "khachhang",
    },
    discountCodes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Discount",
      }
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
authSchema.plugin(mongoosePaginate);
export default mongoose.model("Auth", authSchema);
