import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Orders.css"

const Orders = ({url}) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/admin/all-orders`);
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Failed to load orders");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Error loading orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `${url}/api/order/admin/update-status`,
                { orderId, status: newStatus }
            );

            if (response.data.success) {
                toast.success("Order status updated");
                fetchOrders();
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Error updating order status");
        }
    };

    if (loading) {
        return <div className="orders-admin"><h2>Loading orders...</h2></div>;
    }

    return (
        <div className="orders-admin">
            <h2>📦 All Orders</h2>
            {orders.length === 0 ? (
                <p className="no-orders">No orders yet</p>
            ) : (
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="order-row">
                                    <td className="order-id-cell">
                                        <strong>{order._id.slice(-8).toUpperCase()}</strong><br/>
                                        <small>{new Date(order.date).toLocaleDateString()}</small>
                                    </td>
                                    <td className="customer-cell">
                                        <strong>{order.address.firstName} {order.address.lastName}</strong><br/>
                                        <small>📞 {order.address.phone}</small><br/>
                                        <small>📧 {order.address.email}</small>
                                    </td>
                                    <td className="items-cell">
                                        {order.items.map((item, idx) => (
                                            <div key={idx}>
                                                {item.name} x{item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="amount-cell">
                                        <strong>₹{order.amount.toFixed(2)}</strong>
                                    </td>
                                    <td className="payment-cell">
                                        <div className="payment-badge">
                                            <span>{order.paymentMethod === 'cash' ? '💵' : order.paymentMethod === 'upi' ? '📱' : '💳'}</span>
                                            <span className={order.paymentStatus === 'Completed' ? 'paid' : 'pending'}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="status-cell">
                                        <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        <select 
                                            className="status-dropdown"
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Orders;