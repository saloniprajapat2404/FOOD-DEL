import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view orders');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/user-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError('No orders found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err?.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ff9800',
      'Confirmed': '#2196F3',
      'Preparing': '#ff6347',
      'Out for Delivery': '#4CAF50',
      'Delivered': '#4CAF50',
      'Cancelled': '#999'
    };
    return colors[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '⏳',
      'Confirmed': '✓',
      'Preparing': '👨‍🍳',
      'Out for Delivery': '🚗',
      'Delivered': '✓✓',
      'Cancelled': '❌'
    };
    return icons[status] || '•';
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/order/cancel`,
          { orderId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          alert('Order cancelled successfully');
          fetchOrders(); // Refresh orders
        }
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to cancel order');
        console.error('Cancel error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className='orders-page'>
        <h2>My Orders</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className='orders-page'>
      <h2>📦 My Orders</h2>
      
      {error && <p className='error-message'>{error}</p>}
      
      {orders.length === 0 ? (
        <div className='no-orders'>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. <a href="/">Start ordering now!</a></p>
        </div>
      ) : (
        <div className='orders-list'>
          {orders.map((order) => (
            <div key={order._id} className='order-card'>
              <div className='order-header'>
                <div className='order-id'>
                  <h3>Order ID: {order._id.slice(-8).toUpperCase()}</h3>
                  <p className='order-date'>{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</p>
                </div>
                <div className='order-status'>
                  <span style={{ 
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                  {(order.status === 'Pending' || order.status === 'Confirmed') && (
                    <button 
                      className='cancel-btn'
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className='order-items'>
                <h4>Items Ordered:</h4>
                <div className='items-list'>
                  {order.items.map((item, idx) => (
                    <div key={idx} className='order-item'>
                      <p><strong>{item.name}</strong> x {item.quantity}</p>
                      <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='order-details'>
                <div className='delivery-info'>
                  <h4>📍 Delivery Address:</h4>
                  <p>
                    {order.address.firstName} {order.address.lastName}<br/>
                    {order.address.street}, {order.address.city}<br/>
                    {order.address.state} {order.address.zipCode}, {order.address.country}<br/>
                    📞 {order.address.phone}
                  </p>
                </div>

                <div className='payment-info'>
                  <h4>Payment Details:</h4>
                  <p><strong>Method:</strong> {
                    order.paymentMethod === 'cash' ? '💵 Cash on Delivery' :
                    order.paymentMethod === 'upi' ? '📱 UPI' :
                    '💳 Card'
                  }</p>
                  <p><strong>Status:</strong> {order.paymentStatus === 'Completed' ? '✓ Paid' : '⏳ Pending'}</p>
                </div>

                <div className='amount-info'>
                  <h4>Amount:</h4>
                  <p className='total-amount'>₹{order.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className='order-timeline'>
                <h4>Status Timeline:</h4>
                <div className='timeline'>
                  {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`timeline-step ${
                        ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].indexOf(order.status) >= idx ? 'completed' : ''
                      }`}
                    >
                      <div className='timeline-dot'></div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
