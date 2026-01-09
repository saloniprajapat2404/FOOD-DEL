import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
const PlaceOrder = () => {

  const {getTotalCartAmount} = useContext(StoreContext)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order data:', formData);
    // TODO: Send order and payment data to backend
    alert('Proceeding to payment with data: ' + JSON.stringify(formData));
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name="firstName" placeholder='First Name' value={formData.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder='Last Name' value={formData.lastName} onChange={handleInputChange} required />
        </div>
        <input type="text" name="email" placeholder='Email address' value={formData.email} onChange={handleInputChange} required />
        <input type="text" name="street" placeholder='Street' value={formData.street} onChange={handleInputChange} />
        <div className="multi-fields">
          <input type="text" name="city" placeholder='City' value={formData.city} onChange={handleInputChange} />
          <input type="text" name="state" placeholder='State' value={formData.state} onChange={handleInputChange} />
        </div>
        <div className="multi-fields">
          <input type="text" name="zipCode" placeholder='Zip Code' value={formData.zipCode} onChange={handleInputChange} />
          <input type="text" name="country" placeholder='Country' value={formData.country} onChange={handleInputChange} />
        </div>
        <input type="text" name="phone" placeholder='Phone' value={formData.phone} onChange={handleInputChange} />
      </div>
      <div className="place-order-right">
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount()===0?0:50}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{ getTotalCartAmount()===0?0:getTotalCartAmount()+50}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
