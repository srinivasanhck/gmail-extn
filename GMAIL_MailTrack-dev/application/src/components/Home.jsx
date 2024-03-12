import { useEffect, useState } from 'react';
import "../css/home.css";
import image from "../assets/signupimage.svg"
import Googlesvg from '../assets/Googlesvg';
import axios from "axios";
// import Doalign from '../assets/Doalign';
import Logo from "../assets/logo.svg"
const client_id = "250134009581-jbve639tu19bbdb2ce779ert7j1n8vc2.apps.googleusercontent.com";
// const client_id = "341511691461-goquvmj268iad297ckh502qqf6q39uug.apps.googleusercontent.com";
const redirectUri = "http://localhost:5174";
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.profile`;
// import Logo from '../assets/Logo';
const Home = () => {

    //for opening in popup window
//   const handleAuthentication = () => {
//    const popup = window.open(authUrl, '_blank', `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`);

//    const popupListener = setInterval(() => {
//      if (popup.closed) {
//        clearInterval(popupListener);
//      } else {
//        try {
//          if (popup.location.search.includes('code=')) {
//            const urlParams = new URLSearchParams(popup.location.search);
//            const code = urlParams.get('code');
//            console.log('Authentication code:', code);
//            popup.close();
//          }
//        } catch (error) {
//          console.error('Error:', error);
//        }
//      }
//    }, 500);
//  };


  const [token, setToken] = useState(null);
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const popupWidth = 500; 
  const popupHeight = 500; 

   const left = (screenWidth - popupWidth) / 2;
   const top = (screenHeight - popupHeight) / 2;


   const [tokenRecieved, setTokenRecieved] = useState(false);

  const handleAuthentication = () => {
    window.location.href = authUrl;
  }

  // Handle the OAuth response when the component mounts
  useEffect(() => {
    localStorage.setItem("accesss",123);
    const handleOAuthResponse = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        console.log("code", code);
        window.history.replaceState({}, document.title, window.location.pathname);
        try{
          const response=await axios.post("https://stage.ekalign.com/api/auth/oauth/callback/request",{
            authorizationCode: code
            })
          console.log("response", response);
           window.postMessage({ type: 'authSuccess', accessToken: response.data.token }, '*');
        }
        catch(error){
          console.log("error",error);
        }
        // Exchange code for access token
        // await exchangeCodeForAccessToken(code);
      }
    }
    if (window.location.search.includes('code=')) {
      handleOAuthResponse();
    }
  }, [tokenRecieved]);

  // Function to exchange authorization code for access token
  // const exchangeCodeForAccessToken = async (code) => {
  //   const tokenUrl = `https://oauth2.googleapis.com/token`;
  //   const data = {
  //     client_id: client_id,
  //     client_secret: "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",
  //     code: code,
  //     redirect_uri: redirectUri,
  //     grant_type: "authorization_code"
  //   };

  //   try {
  //     const response = await fetch(tokenUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to exchange code for token");
  //     }

  //     const tokenData = await response.json();
  //     const accessToken = tokenData.access_token;
  //     // Store access token or perform other actions
  //     console.log("Access Token:", tokenData);
  //     localStorage.setItem("access_token", accessToken);
  //     if (accessToken) {
  //       setTokenRecieved(!tokenRecieved);
  //       // window.postMessage({ type: 'authSuccess', accessToken: accessToken }, '*');
  //       // window.open('https://mail.google.com', '_blank');
  //     }

  //   } 
  //   catch (error) {
  //     console.error("Error exchanging code for token:", error);
  //   }
  // }

  return (
    <>
      <section className='section0'>
        <div className='container nav-div'>
          <div className='nav-div-leftBox'>
            <div className='logo'>
              <img src={Logo} alt="GetAligned" />
            </div>

            {/* <div className='nav-div-leftbox-nameDiv'>doalign.work</div> */}
          </div>

          <button className='nav-div-rightBox'>
            Learn More
          </button>
        </div>
      </section>

      <section className='section1'>
        <div className='container login-sectionMainDiv'>
          <div className='login-section-leftDiv'>
            <div className='login-section-leftDiv-innerDiv1'>
              <div className='innerDiv1-loginText'>
                Login with your Google account
              </div>
              <div className='innerDiv1-loginTextPara'>
                Doalign helps you manage your time, tasks, and projects so you can focus on  the work that matters.
              </div>
            </div>
            <div className='login-section-leftDiv-innerDiv2'>
              {
                // tokenRecieved ? <button  onClick={() => window.open('https://mail.google.com', '_blank')}>Go to Gmail</button> :
                <div className='signInOuter-div'>
                  <button onClick={handleAuthentication} className='signin-button'> <Googlesvg /> Login with Google</button>
                </div>
              }

              <div className='signInDiv2'>
                By selecting "Log in with Google"
                you acknowledge and agree to the <a href="https://www.google.com/accounts/authsub/terms.html#:~:text=In%20connection%20with%20your%20use,associated%20Google%20service%20(the%20%22Program" target='_blank'>Terms of Use.</a>
              </div>
            </div>
          </div>
          

          <div className='login-section-rightImageDiv'>
            <img src={image} alt="" width={"100%"} height={"579px"} />
          </div>
        </div>
      </section>

    </>
  );
}

export default Home;











// const [tokenRecieved, setTokenRecieved] = useState(false);

//   const handleAuthentication = () => {
//     // Redirect user to the authorization endpoint
//     window.location.href = authUrl;
//   }

//   // Handle the OAuth response when the component mounts
//   useEffect(() => {
//     const handleOAuthResponse = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const code = urlParams.get('code');
//       if (code) {
//         console.log("code", code);
//         // Exchange code for access token
//         await exchangeCodeForAccessToken(code);
//         // window.history.replaceState({}, document.title, window.location.pathname);
//       }
//     }
//     if (window.location.search.includes('code=')) {
//       handleOAuthResponse();
//     }
//   }, [tokenRecieved]);

//   // Function to exchange authorization code for access token
//   const exchangeCodeForAccessToken = async (code) => {
//     const tokenUrl = `https://oauth2.googleapis.com/token`;
//     const data = {
//       client_id: client_id,
//       client_secret: "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",
//       code: code,
//       redirect_uri: redirectUri,
//       grant_type: "authorization_code"
//     };

//     try {
//       const response = await fetch(tokenUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       });

//       if (!response.ok) {
//         throw new Error("Failed to exchange code for token");
//       }

//       const tokenData = await response.json();
//       const accessToken = tokenData.access_token;
//       // Store access token or perform other actions
//       console.log("Access Token:", accessToken);
//       localStorage.setItem("access_token", accessToken);
//       if (accessToken) {
//         setTokenRecieved(!tokenRecieved);
//         window.postMessage({ type: 'authSuccess', accessToken: accessToken }, '*');
//         // window.open('https://mail.google.com', '_blank');
//       }

//     } 
//     catch (error) {
//       console.error("Error exchanging code for token:", error);
//     }
//   }
