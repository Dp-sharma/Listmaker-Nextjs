import React from 'react'
import './about.css'

const About = () => {
  return (
    <div className='about' >
      <div className="box">
        <h1 style={{fontSize:'6vh',color:'#f4a3f4',fontWeight:'700'}}>About us</h1>
        <img src="mypic.png" alt="mypic" className='mypic' />
        <div className='content'>
        <span className='font-extrabold text-4xl block m-3'>
          Deepansh Sharma
          </span>Professional Summary

Skilled Full Stack Web Developer proficient in HTML, CSS, JavaScript, Node.js, Express.js, React, Next.js, MongoDB, and Mongoose. Proven track record in delivering high-quality, user-centric applications. Demonstrated leadership as a two-term head boy and strong communicator through NGO work. Experienced in app testing, version control (Git), Excel, and PowerPoint. Passionate about solving problems and enhancing user experiences through technology.
        </div>
        <span className='all_social'>
          <a href="https://www.instagram.com/dp____sharma/" target='_blank'><img src="instagram.png" alt="instagram" className="social" /></a>
          <a href="https://www.linkedin.com/in/deepansh-sharma-/" target='_blank'><img src="linkedin.png" alt="linkedin" className="social" /></a>
          <a href="https://www.youtube.com/@deepanshsharma7847" target='_blank'><img src="youtube.png" alt="youtube" className="social" /></a>
          </span>
      </div>
    </div>
  )
}

export default About
