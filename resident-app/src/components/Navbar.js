import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
};

export default Navbar;
