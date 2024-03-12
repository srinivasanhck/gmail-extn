import ContentController from "../core/controllers/ContentController";

import Util from "../core/util/Util";
import Cookies from 'js-cookie';

//getting token from application window
window.addEventListener("message", async (event) => {
  if(event.data.type=="authSuccess"){
    console.log("eventt",event.data);
    localStorage.setItem("authSuccesssssss",event.data.accessToken);
    chrome.runtime.sendMessage({ type: 'accessToken', accessToken: event.data.accessToken });
    console.log("authSuccess in extc",event.data.accessToken);
  }

});


async function getAccessToken() {
  // Retrieve token from storage
  const token = await new Promise<string>((resolve) => {
    chrome.storage.sync.get("accessToken", (data) => {
      console.log("Access token in getc", data.accessToken);
      resolve(data.accessToken);
    });
  });
  return token;
}

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
if(message.action=="showToast"){
  // sendAnalyticsEvent(message.eventName, message.eventParams);
  const toast=document.querySelector(".extension-toast");
  console.log("toast",toast);
  if(toast){
    toast.classList.add("active");
    setTimeout(()=>{
      toast.classList.remove("active");
    },3000)
  }
}
})

function bootstrap() {
  // console.log(1, "bootsterap");
  // injectGtmContainerSnippet();
  const content = new ContentController();

  content.init();
  
  Util.create_window_api(content);

  return content;
}





async function checkAuthenticationAndBootstrap() {
  const accessToken = await getAccessToken();
  console.log("ckecking for token in cont script initially", accessToken);
  if (accessToken) {
    // chrome.runtime.sendMessage({action:"entertedContentScript with authentication",eventName:"entertedContentScript with authentication"})
    const instance = bootstrap();
    }
  }
  
  checkAuthenticationAndBootstrap();



  //google analytics 1st method, directly connecting GA4 with the extension

// async function getOrCreateClientId() {
//   const result = await chrome.storage.local.get('clientId');
//   let clientId = result.clientId;
//   if (!clientId) {
//     // Generate a unique client ID, the actual value is not relevant
//     clientId = self.crypto.randomUUID();
//     await chrome.storage.local.set({clientId});
//   }
//   return clientId;
// }

// const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
// const MEASUREMENT_ID = `G-PJ6QX6B3S1`; 
// const API_SECRET = 'AIzaSyBIeYZz-39p940psM6ncphiKRxLRIZ3rOE';

// async function sendAnalyticsEvent(eventName:String, eventParams = {}) {
//   const clientId = await getOrCreateClientId();
//   const url = `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
//   const payload = {
//     client_id: clientId,
//     events: [{
//       name: eventName,
//       params: eventParams
//     }]
//   };
  
//   const response = await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(payload),
//     headers: { 'Content-Type': 'application/json' }
//   });
  
//   if (!response.ok) {
//     console.error('Error sending analytics event:', response.statusText);
//   }
// }
  