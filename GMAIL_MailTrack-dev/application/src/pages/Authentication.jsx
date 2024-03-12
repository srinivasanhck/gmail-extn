
// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from "react-router-dom";

// const CLIENT_ID = "250134009581-jbve639tu19bbdb2ce779ert7j1n8vc2.apps.googleusercontent.com";
// const REDIRECT_URI = "http://127.0.0.1:5174/";

// const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent("https://www.googleapis.com/auth/gmail.modify")}&response_type=code`;

// const Authentication = () => {

//   const handleAuth = () => {
//     console.log("clicked");
//     window.location.href = authUrl;
//   };

//   return (
//     <>
//       <div>Authentication</div>
//       <button onClick={handleAuth}>Connect with Google</button>
//     </>
//   );
// };

// export default Authentication;








// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from "react-router-dom";

// const CLIENT_ID = "250134009581-jbve639tu19bbdb2ce779ert7j1n8vc2.apps.googleusercontent.com";
// const REDIRECT_URI = "http://127.0.0.1:5174/";

// const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent("https://www.googleapis.com/auth/gmail.modify")}&response_type=token`;

// const Authentication = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleAuth = () => {
//     console.log("clicked");
//     window.location.href = authUrl;
//   };

//   return (
//     <>
//       <div>Authentication</div>
//       <button onClick={handleAuth}>Connect with Google</button>

//     </>
//   );
// };

// export default Authentication;



import React from 'react'

const Authentication = () => {
  return (
    <div>Authentication</div>
  )
}

export default Authentication







// import React, { useEffect } from 'react'
// import { useLocation, useNavigate } from "react-router-dom";

// const CLIENT_ID = "250134009581-jbve639tu19bbdb2ce779ert7j1n8vc2.apps.googleusercontent.com";
// const CLIENT_SECRET = "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";
// const REDIRECT_URI = "http://127.0.0.1:5174/";

// const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent("https://www.googleapis.com/auth/gmail.modify")}&response_type=code`;

// const Authentication = () => {

//   const navigate=useNavigate();
//   const location=useLocation()

//   const handleAuth = async () => {
//   console.log("clicked");
//   window.location.href=authUrl;
//   };


//   async function exchangeCodeForAccessToken(code) {
//     console.log("Exchanging code for access token");
//     // Construct request to exchange code for token
//     const tokenUrl = `https://oauth2.googleapis.com/token`;
//     const data = {
//       client_id: CLIENT_ID,
//       client_secret:CLIENT_SECRET ,
//       code: code,
//       redirect_uri: REDIRECT_URI,
//       grant_type: "authorization_code"
//     };
  
//     try {
//       // Send POST request to exchange code for token
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
//       console.log("tokendata " + tokenData)
//       const accessToken = tokenData.access_token;
//       console.log("AccessToken", accessToken);
//       // Store access token
//       localStorage.setItem("token_oauth2", accessToken);
//     } 
//     catch (error) {
//       console.log("Error exchanging code for token:", error);
//     }
//   }


//   useEffect(()=>{
//     const searchParams=new URLSearchParams(location.search);
//     const code=searchParams.get("code");
//     console.log("code",code);
//     if(code){
//       exchangeCodeForAccessToken(code);
//     }
//   },[location,navigate]);

//   return (
//     <>
//       <div>Authentication</div>
//         <button onClick={handleAuth}>Connect with Google</button>
//     </>
//   );
// };

// export default Authentication;























// import React from 'react';

// const CLIENT_ID = "250134009581-jbve639tu19bbdb2ce779ert7j1n8vc2.apps.googleusercontent.com";
// const REDIRECT_URI = "http://127.0.0.1:5174/";
// const SCOPE = "https://www.googleapis.com/auth/gmail.modify";
// const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/auth";
// const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
// const CLIENT_SECRET="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";

// const initiateAuthentication = async () => {
//   try {
//     // Step 1: Initiate authentication by redirecting the user to the authorization endpoint
//     const response = await fetch(AUTH_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         client_id: CLIENT_ID,
//         redirect_uri: REDIRECT_URI,
//         scope: SCOPE,
//         response_type: 'code'
//       })
//     });

//     if (!response.ok) {
//       throw new Error('Failed to initiate authentication');
//     }

//     // Step 2: Log the response to the console
//     const responseData = await response.json();
//     console.log('Authentication response:', responseData);

//     // Step 3: If successful, exchange the authorization code for an access token
//     const authorizationCode = responseData.code;
//     const tokenResponse = await exchangeCodeForAccessToken(authorizationCode);
//     console.log('Access token:', tokenResponse.access_token);
    
//   } catch (error) {
//     console.error('Error initiating authentication:', error);
//   }
// };

// const exchangeCodeForAccessToken = async (code) => {
//   try {
//     // Construct request to exchange code for token
//     const response = await fetch(TOKEN_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         code: code,
//         redirect_uri: REDIRECT_URI,
//         grant_type: 'authorization_code'
//       })
//     });

//     if (!response.ok) {
//       throw new Error('Failed to exchange code for token');
//     }

//     // Return the token response
//     return await response.json();
//   } catch (error) {
//     console.error('Error exchanging code for token:', error);
//     return null;
//   }
// };

// const handleAuthClick = () => {
//   initiateAuthentication();
// };

// const App = () => {
//   return (
//     <div>
//       <h1>OAuth 2.0 Authentication</h1>
//       <button onClick={handleAuthClick}>Authenticate with Google</button>
//     </div>
//   );
// };

// export default App;



