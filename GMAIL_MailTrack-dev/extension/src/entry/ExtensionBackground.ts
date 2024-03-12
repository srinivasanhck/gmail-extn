import Util from "../core/util/Util";
import { APP_URL } from "../../../shared/config";
// Function to retrieve access token
async function getAccessToken() {
  console.log("getAccessToken() called");
  // Retrieve token from storage
  const token = await new Promise((resolve) => {
    chrome.storage.sync.get("accessToken", (data) => {
      console.log("Access token in get");
      resolve(data.accessToken);
    });
  });
  if (token) {
    // Add logic to check token expiration if necessary
    return token;
  } else {
    // Token does not exist or expired, return null
    return null;
  }
}

// Function to store access token
function storeAccessToken(token: any) {
  // Store token in storage
  chrome.storage.sync.set({ accessToken: token }, () => {
    console.log("Access token stored successfully", token);
  });
}


async function fetchAccessToken() {
  try {
    let response = await fetch("https://stage.ekalign.com/api/v1/user-session/get-user-session", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await getAccessToken()}`
      }
    })
    let res = await response.json();
    console.log("response from fetchAccessToken", res.accessToken);
    return res.accessToken;
  }
  catch (error) {
    console.log("Failed to fetchAccessToken");
  }
}

// Function to check if label exists
async function checkLabelExists(labelName: String) {
  console.log("Checking label exits");
  try {
    // Fetch the list of labels from Gmail API
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/labels`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await fetchAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log("Failed to fetch labels from Gmail API");
      return false;
    }

    const labels = await response.json();

    // Check if the labelName exists in the labels list
    for (const label of labels.labels) {
      if (typeof label === 'object' && label.name === labelName) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking if label exists:", error);
    return false; // Return false on error to prevent label creation
  }
}


async function getLabelId(labelName: String) {
  const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/labels`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${await fetchAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.log("Failed to fetch labels from Gmail API");
    return null;
  }

  const labels = await response.json();

  for (const label of labels.labels) {
    if (typeof label === 'object' && label.name === labelName) {
      console.log("labbbbel", label);
      return label.id;
    }
  }

  console.log(`Label with name "${labelName}" not found in getLabelId`);
  return null;
}


async function applyLabelToEmail(messageId: any, labelId: any) {
  const userId = 'me';
  const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

  const requestBody = {
    addLabelIds: [labelId]
  };

  try {
    const accessToken = await fetchAccessToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    console.log("respose.ok in applyLabelToMmail", response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to apply label to email:${errorText}`);
    }
    else {
      console.log("Label applied successfully to email:", messageId);
      console.log("invoked refreshGmail");
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showToast',eventName:"TOAST" });

    });

    }
  }
  catch (error) {
    console.log("Error applying label to email:", error);
  }
}


async function handleOAuthAndCreateLabel(labelName: String) {
  // Function to handle OAuth flow and label creation
  console.log("Entered handleOAuthAndCreateLabel");
  const storedToken = await getAccessToken();
  console.log("Token handleOauthAndCreateLabel stored Token:", storedToken);

  // const token = await fetchAccessToken();
  // console.log("got original Token", token);

  try {
    // Check if label already exists

    const labelExists = await checkLabelExists(labelName);
    if (labelExists) {
      console.log("Label already exists:", labelName);
      return;
    }

    // Create label using authenticated API request
    console.log("Creating label:", labelName);
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/labels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await fetchAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: labelName,
        labelListVisibility: "labelHide" // Hide label from label list
      })
    });

    if (!response.ok) {
      throw new Error("Error creating label:" + await response.text());
    }

    console.log(`Label "${labelName}" created successfully!`)

  }
  catch (error) {
    console.log("Error label create :", error);
  }
}

// async function applyLabelToEmail(messageId:any, labelName:any) {
//   try {
//     const appScriptUrl = "https://script.google.com/macros/s/AKfycbzviu546-IL-pQpmliP_uAFw9_nSYqLjrTeUs8erN-OKeiVRGwANJWAmxcEwpH1E06H/exec"; 
//     const response = await fetch(appScriptUrl, {
//       method: "POST",
//       body: JSON.stringify({ paramValue: messageId, labelName: labelName }),
//       mode:"no-cors",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//     console.log("App Script request sent (CORS disabled)");
//     console.log("response1",response);
//     if (!response.ok) {
//       throw new Error(`App Script request failed with status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("App Script result:", result);
//     return result;
//   } catch (error) {
//     console.error("Error calling App Script:", error);
//     throw error; 
//   }    
// }


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // Listener for messages from OAuth consent page
  console.log("Request type:", request.type);
  if (request.type == "applyLabel") {
    console.log("applyLabel called");
    try {
      const labelName = "catchup"; // Label name to apply
      const labelId = await getLabelId(labelName);
      await applyLabelToEmail(request.messageId, labelId);
      sendResponse({ success: true });
    }
    catch (error) {
      console.log("Error applying label:", error);
    }
  }
  else if (request.type === "accessToken") {
    console.log("Received access token in bg:", request.accessToken);
    storeAccessToken(request.accessToken);
    if (request.accessToken) {
      let label = "catchup";
      handleOAuthAndCreateLabel(label);
    }
  }
  else if (request.type == "refreshh") {
    console.log("Refreshh");
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: "refreshh" }, function (response) {
          if (chrome.runtime.lastError) {
            console.log("Error sending message:", chrome.runtime.lastError.message);
          } else {
            console.log("Message sent successfully to tab:", tab.id);
          }
        });
      });
    });
  }
});


// Entry point: Check if label exists after authentication
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Entered/listened on install");
  // chrome.tabs.create({ url: "http://localhost:5174/" });
});



//google analytics

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


// chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
//   console.log("message senttt", message.action);
// if(message.action==="entertedContentScript with authentication"){
//   sendAnalyticsEvent(message.eventName, message.eventParams);
// }
// else if(message.action==="appliedLabel"){
//   sendAnalyticsEvent(message.eventName, message.eventParams);
// }
// })



async function main() {

  // chrome.runtime.onInstalled.addListener(async () => {
  //   const current_tab: any = await Util.tab_create({
  //     url: REDIRECT_URL_AFTER_EXTENSION_DOWNLOAD,
  //     active: true,
  //   });

  //   await Util.runtime_send_message(current_tab.id, {
  //     action: "click-action",
  //     data: null,
  //   });
  // });
  console.log("start")
  chrome.action.onClicked.addListener(async (tab) => {
    console.log("start1");
    const tab_url = new URL(tab.url);
    let current_tab: any = null;

    // if (tab_url.protocol === "chrome:") {
    //   current_tab = await Util.tab_create({
    //     url: APP_URL,
    //     active: true,
    //   });
    // }

    const tabs_other = await chrome.tabs.query({
      active: false,
    });
    for (let tab of tabs_other) {
      await Util.runtime_send_message(tab.id, {
        action: "iframe-destroy",
        data: null,
      });
    }

    if (!current_tab) {
      [current_tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
    }
    // Sends a "click-action" message to the active tab's content script, initiating actions there.
    await Util.runtime_send_message(current_tab.id, {
      action: "click-action",
      data: null,
    });
  });
}

main();

