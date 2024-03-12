import React from 'react';
import "../css/landingPage.css";
import Logo from "../assets/logo.svg";
import Googlesvg from '../assets/Googlesvg';

const LandingPage = () => {
  return (
    <>
     <section className='section0'>
        <div className='container nav-div'>
          <div className='nav-div-leftBox'>
            <div className='logo'>
              <img src={Logo} alt="GetAligned" />
            </div>
          </div>

          {/* <button className='nav-div-rightBox'>
            Learn More
          </button> */}
        </div>
      </section>

      <section className='section1'>
        <div className='container loginSection-mainDiv'>
            <div className='top-left-circle'>
            

            {/* big-div */}
            <div className='big-div'>
                <div className='big-div-innerDiv1'>
                    <div className="innerDiv1-login">
                        Login with your Google account
                    </div>
                    <div className="innerDiv1-content">
                    Get Aligned facilitates efficient time, task, and project management, empowering you to prioritize meaningful work.
                    </div>
                </div>
                <div className='big-div-innerDiv2'>
                    <div className='innerDiv2-login'>
                    <button className='signin-button'> <Googlesvg /> Login with Google</button>
                    </div>
                    <div className='signInDiv2'>
                By selecting "Log in with Google"
                you acknowledge and agree to the <a href="https://www.google.com/accounts/authsub/terms.html#:~:text=In%20connection%20with%20your%20use,associated%20Google%20service%20(the%20%22Program" target='_blank'>Terms of Use.</a>
              </div>
                </div>
            </div>
            </div>
            <div className='bottom-circles'>
            <div className='bottom-left-circle'>

            </div>
            <div className='bottom-right-circle'>

            </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage