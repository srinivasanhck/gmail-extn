import React from 'react'
import {Route, Routes} from "react-router-dom";
import Authentication from '../pages/Authentication';
import Home from '../components/Home';
import LandingPage from '../pages/LandingPage';
const Allroutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />}/>
        {/* <Route path='/' element={<LandingPage />}/> */}
        <Route path='/auth' element={<Authentication />} />
    </Routes>
  )
}

export default Allroutes