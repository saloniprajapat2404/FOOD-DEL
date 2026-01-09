import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({setShowLogin}) => {


    const [menu,setMenu] = useState("menu");
    const {getTotalCartAmount} = useContext(StoreContext);
    const [user,setUser] = useState(null);

    useEffect(()=>{
      const stored = localStorage.getItem('user');
      if(stored) setUser(JSON.parse(stored));

      const handler = () => {
        const s = localStorage.getItem('user');
        setUser(s ? JSON.parse(s) : null);
      }
      window.addEventListener('userChanged', handler);
      return () => window.removeEventListener('userChanged', handler);
    },[])
    

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
       <ul className="navbar-menu">
        <Link to="/" onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</a>
        <a href='#aap-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact-us</a>
       </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
      {user ? (
        <div className="navbar-user">
          <span>Hello, {user.name}</span>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); window.dispatchEvent(new Event('userChanged')) }}>Logout</button>
        </div>
      ) : (
        <button onClick={()=>setShowLogin(true)}>sign in</button>
      )}
       </div>
    </div>
  )
}

export default Navbar
