import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            foodId: String,
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    amount: { type: Number, required: true },
    address: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String
    },
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'upi', 'card'], 
        required: true 
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    date: { type: Date, default: Date.now },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
