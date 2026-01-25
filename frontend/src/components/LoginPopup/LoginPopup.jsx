import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import axios from 'axios'


const LoginPopup = ({setShowLogin}) => {

    const [currState,setCurrState] = useState("Login")
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleSubmit = async (e) => {
      e.preventDefault();
      const API = "https://food-del-backend-48p7.onrender.com";
      try {
        if (currState === 'Sign Up') {
          const resp = await axios.post(`${API}/api/auth/register`, { name, email, password });
          if (resp.data.success) {
            const { token, user } = resp.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('userChanged'));
            console.log('Register success:', user.email);
            setShowLogin(false);
          }
        } else {
          const resp = await axios.post(`${API}/api/auth/login`, { email, password });
          if (resp.data.success) {
            const { token, user } = resp.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('userChanged'));
            console.log('Login success:', user.email);
            setShowLogin(false);
          }
        }
      } catch (error) {
        console.error('Auth error response:', error?.response);
        console.error('Auth error message:', error?.message);
        // Show a clearer alert if server provided a message
        const serverMsg = error?.response?.data?.message
          || (typeof error?.response?.data === 'string' ? error.response.data : null)
          || error?.response?.statusText
          || error?.message
          || 'Auth failed';
        alert(serverMsg);
      }
    }

  return (
    <div className='login-popup'>
        <form  className="login-popup-container" onSubmit={handleSubmit}>
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
              {currState!=="Login" && (
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder='Your name' required />
              )}
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Your Email' required />
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='password' required />
            </div>
            <button>{currState==="Sign Up"?"Create account":"Login"}</button>
            <div className="login-poppup-condtition">
              <input type="checkbox" required />
              <p>By continuing. i agree to the terms of use & privacy policy.</p>
            </div>
            
            {currState==="Login"
            ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
            :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
            }
        </form>
    </div>
  )
}

export default LoginPopup
