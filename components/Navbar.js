'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import './Navbar.css'
import Profile from './Profile'
// import { useState } from 'react'
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div className="nav relative" id="nav">

        <ul className="navbar">

          <div id='toggle' onClick={toggleMenu}>
            <div id='hamburg-1' className='hamburg'></div>
            <div id='hamburg-2' className='hamburg' ></div>
            <div id='hamburg-3' className='hamburg' ></div>
          </div>

          <div id='nav_title'>My List Maker</div>
          <div className={`toggle_box ${isOpen ? 'show' : 'hide'}`}>
            <div className={`cross ${isOpen ? 'cross_hide' : ''}`} onClick={toggleMenu}>
              <img src="close.png" alt="close" />
            </div>
            <Link href="/"><li className="nav-item">home</li></Link>
            <Link href="mylist"><li className="nav-item">My List</li></Link>
            <Link href="about"><li className="nav-item">About us</li></Link>

          </div>
          <div >
            <Profile />
          </div>

        </ul>
      </div>
    </div>
  )
}

export default Navbar
