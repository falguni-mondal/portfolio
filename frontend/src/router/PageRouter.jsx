import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'

const PageRouter = () => {
  return (
    
    <Routes>   
        <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default PageRouter