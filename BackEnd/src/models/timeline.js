import mongoose from 'mongoose';

export const TimeLineSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Order",
    },
    status: Number
}, {
    timestamps: true
})

export default mongoose.model('TimeLine', TimeLineSchema)