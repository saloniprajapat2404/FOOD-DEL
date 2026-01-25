import orderModel from "../models/orderModel.js";
import jwt from "jsonwebtoken";

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, login required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const userId = decoded.id;

        const { items, amount, address, paymentMethod } = req.body;

        if (!items || !amount || !address || !paymentMethod) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod,
            date: new Date()
        };

        const order = new orderModel(orderData);
        await order.save();

        // For Cash on Delivery, auto-confirm payment
        if (paymentMethod === 'cash') {
            order.paymentStatus = 'Completed';
            await order.save();
        }

        res.json({ 
            success: true, 
            message: "Order placed successfully",
            orderId: order._id,
            order: order
        });

    } catch (error) {
        console.error("Order error:", error?.message || error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const userId = decoded.id;

        const orders = await orderModel.find({ userId }).sort({ date: -1 });

        res.json({ 
            success: true, 
            data: orders 
        });

    } catch (error) {
        console.error("Fetch orders error:", error?.message || error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ 
            success: true, 
            data: order 
        });

    } catch (error) {
        console.error("Fetch order error:", error?.message || error);
        res.status(500).json({ success: false, message: "Error fetching order" });
    }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ date: -1 });
        res.json({ 
            success: true, 
            data: orders 
        });
    } catch (error) {
        console.error("Fetch all orders error:", error?.message || error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ 
            success: true, 
            message: "Order status updated",
            data: order
        });
    } catch (error) {
        console.error("Update order error:", error?.message || error);
        res.status(500).json({ success: false, message: "Error updating order" });
    }
};

// Cancel order (user can only cancel pending orders)
const cancelOrder = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const userId = decoded.id;

        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID required" });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if user owns this order
        if (order.userId !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
        }

        // Only allow canceling pending/confirmed orders
        if (order.status === 'Preparing' || order.status === 'Out for Delivery' || order.status === 'Delivered') {
            return res.status(400).json({ success: false, message: `Cannot cancel ${order.status} order` });
        }

        order.status = 'Cancelled';
        await order.save();

        res.json({ 
            success: true, 
            message: "Order cancelled successfully",
            data: order
        });

    } catch (error) {
        console.error("Cancel order error:", error?.message || error);
        res.status(500).json({ success: false, message: "Error cancelling order" });
    }
};

export { placeOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
