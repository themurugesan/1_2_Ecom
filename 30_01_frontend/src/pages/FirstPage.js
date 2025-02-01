import React from 'react'
import { useNavigate } from 'react-router-dom'
import './FirstPage.css'  // Import the CSS file

const FirstPage = () => {
  let navigate = useNavigate()

  return (
    <div className='bodys'>
<div className="intro-container">
      <h1>Welcome to Our App!</h1>
      <div>
        <button onClick={() => navigate("/admin")}>Admin</button>
        <button onClick={() => navigate("/login")}>User</button>
      </div>
    </div>
    </div>
    
  )
}

export default FirstPage
