import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
        },
        rating: {
            type: Number,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'Auth',
            required: true,
        },
        orderId: {
            type: mongoose.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        status: { type: Number, default: 1 },
        productId: [{
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        }],
        images: [
            {
                type: String,
            }
        ],
        videos: [
            {
                type: String,
            }
        ],
        replies: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false
    },
);

export default mongoose.model('Ordercomments', commentSchema);
