import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const PlaceOrder = () => {

  const {getTotalCartAmount, cartItems, food_list} = useContext(StoreContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderId, setOrderId] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCartItems = () => {
    return food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        foodId: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
        image: item.image
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to place an order');
        setLoading(false);
        return;
      }

      const orderData = {
        items: getCartItems(),
        amount: getTotalCartAmount() + 50,
        address: formData,
        paymentMethod: paymentMethod
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/place`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrderId(response.data.orderId);
        setOrderPlaced(true);
        alert('Order placed successfully! Order ID: ' + response.data.orderId);
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to place order';
      setError(errorMsg);
      alert('Error: ' + errorMsg);
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className='place-order'>
        <div className="place-order-right">
          <div className='cart-total' style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ color: 'green', marginBottom: '20px' }}>✓ Order Placed Successfully!</h2>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              Your Order ID: <strong>{orderId}</strong>
            </p>
            <p style={{ fontSize: '16px', marginBottom: '30px' }}>
              You will receive updates via email
            </p>
            <button type="button" onClick={() => window.location.href = '/'} style={{ marginRight: '10px' }}>
              Back to Home
            </button>
            <button type="button" onClick={() => window.location.href = '/orders'}>
              Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name="firstName" placeholder='First Name' value={formData.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder='Last Name' value={formData.lastName} onChange={handleInputChange} required />
        </div>
        <input type="email" name="email" placeholder='Email address' value={formData.email} onChange={handleInputChange} required />
        <input type="text" name="street" placeholder='Street' value={formData.street} onChange={handleInputChange} required />
        <div className="multi-fields">
          <input type="text" name="city" placeholder='City' value={formData.city} onChange={handleInputChange} required />
          <input type="text" name="state" placeholder='State' value={formData.state} onChange={handleInputChange} required />
        </div>
        <div className="multi-fields">
          <input type="text" name="zipCode" placeholder='Zip Code' value={formData.zipCode} onChange={handleInputChange} required />
          <input type="text" name="country" placeholder='Country' value={formData.country} onChange={handleInputChange} required />
        </div>
        <input type="tel" name="phone" placeholder='Phone' value={formData.phone} onChange={handleInputChange} required />

        {/* Payment Methods */}
        <p className="title" style={{ marginTop: '30px' }}>Payment Method</p>
        <div className="payment-methods">
          <label className="payment-option">
            <input 
              type="radio" 
              name="payment" 
              value="cash" 
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>💵 Cash on Delivery</span>
          </label>
          <label className="payment-option">
            <input 
              type="radio" 
              name="payment" 
              value="upi" 
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>📱 UPI (Google Pay, PhonePe, Paytm)</span>
          </label>
          <label className="payment-option">
            <input 
              type="radio" 
              name="payment" 
              value="card" 
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>💳 Credit/Debit Card</span>
          </label>
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>

      <div className="place-order-right">
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:50}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+50}</b>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'PROCEED TO PAYMENT'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder

